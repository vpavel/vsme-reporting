"use client";
import { useState, useEffect, useMemo } from "react";
import TabContainer, { TabConfig } from "@/components/ui/TabContainer";
import { useTabs } from "@/hooks/useTabs";
import { useGeneralInfoApi } from "@/hooks/useGeneralInfoApi";
import Form from "@/components/forms/Form";
import { b1FormItems, b2FormItems, formMetadata } from "@/constants/formData";
import { FormType, FormStatus } from "@/types/forms";
// import { useAuth } from "@/contexts/AuthContext"; // Uncomment this
import { useAuth } from "@/contexts/AuthContext"; // Use your actual auth

type GeneralTab = "b1" | "b2";

// Tab configuration
const generalTabs: TabConfig<GeneralTab>[] = [
  {
    key: "b1",
    fullName: "B1 - Basis for Preparation",
    displayName: "B1 - Basis for Preparation",
  },
  {
    key: "b2",
    fullName: "B2 - Practices, Policies and Future Initiatives for transitioning towards a more sustainable economy",
    displayName: "B2 - Practices, Policies and Future Initiatives...",
  },
];

export default function GeneralInformationPage() {
  // Get auth data
  const auth = useAuth();

  // Extract userId from your User interface
  const userId = auth.user?.id;

  // API hook
  const { loading, error, b1Form, b2Form, saveForm } = useGeneralInfoApi(userId!);

  // Individual tab data states
  const [b1Data, setB1Data] = useState<Record<string, string>>({});
  const [b2Data, setB2Data] = useState<Record<string, string>>({});

  // Load existing form data when forms are fetched
  useEffect(() => {
    if (b1Form?.data) {
      setB1Data(b1Form.data);
    }
  }, [b1Form]);

  useEffect(() => {
    if (b2Form?.data) {
      setB2Data(b2Form.data);
    }
  }, [b2Form]);

  // Memoize form items to prevent infinite re-renders (THIS IS THE KEY FIX)
  const b1FormItemsWithValues = useMemo(
    () => b1FormItems.map((item) => ({ ...item, value: b1Data[item.id] || "" })),
    [b1Data] // Only recreate when b1Data changes
  );

  const b2FormItemsWithValues = useMemo(
    () => b2FormItems.map((item) => ({ ...item, value: b2Data[item.id] || "" })),
    [b2Data] // Only recreate when b2Data changes
  );

  // Tab management with custom hook
  const { activeTab, changeTab, getTabCompletion, calculateProgress, handleTabSubmit } = useTabs<GeneralTab>({
    initialTab: "b1",
    tabData: { b1: b1Data, b2: b2Data },
    setTabData: { b1: setB1Data, b2: setB2Data },
  });

  // Add completion status to tabs
  const tabsWithCompletion = generalTabs.map((tab) => ({
    ...tab,
    isCompleted: getTabCompletion(tab.key),
  }));

  // Calculate progress
  const progress = calculateProgress(["b1", "b2"]);
  const progressText = progress.isComplete
    ? "General Information Complete!"
    : progress.completed === 1
      ? "B1 Complete - Continue with B2"
      : "Complete B1 to unlock B2";

  // Tab submission handlers with API integration
  const handleB1Submit = async (data: Record<string, string>) => {
    try {
      await saveForm(FormType.GENERAL_INFO_B1, data, FormStatus.SUBMITTED);
      handleTabSubmit("b1", data, "b2");
    } catch (err) {
      console.error("Failed to save B1 form:", err);
      // Handle error (show toast, etc.)
    }
  };

  const handleB2Submit = async (data: Record<string, string>) => {
    try {
      await saveForm(FormType.GENERAL_INFO_B2, data, FormStatus.SUBMITTED);
      handleTabSubmit("b2", data);
      console.log("Complete General Information data:", { ...b1Data, ...data });
    } catch (err) {
      console.error("Failed to save B2 form:", err);
      // Handle error (show toast, etc.)
    }
  };

  // Auto-save functionality (optional)
  // const handleAutoSave = async (formType: FormType, data: Record<string, string>) => {
  //   try {
  //     await saveForm(formType, data, FormStatus.DRAFT);
  //   } catch (err) {
  //     console.error('Auto-save failed:', err);
  //   }
  // };

  // Show loading state only when we don't have any data yet
  if (loading && Object.keys(b1Data).length === 0 && Object.keys(b2Data).length === 0) {
    return <div>Loading forms...</div>;
  }

  if (error) {
    return <div>Error loading forms: {error}</div>;
  }

  return (
    <TabContainer<GeneralTab>
      tabs={tabsWithCompletion}
      activeTab={activeTab}
      onTabChange={changeTab}
      title="General Information"
      subtitle="Complete both sections to provide comprehensive information about your company"
      progressPercentage={progress.percentage}
      progressText={progressText}
    >
      {/* Tab Content */}
      {activeTab === "b1" && (
        <Form
          title={formMetadata.b1.title}
          subtitle={formMetadata.b1.subtitle}
          items={b1FormItemsWithValues} // Use memoized version
          onSubmit={handleB1Submit}
          submitButtonText={formMetadata.b1.submitButtonText}
          loading={loading}
          errors={error ? [{ field: "general", message: error, code: "GENERAL_ERROR" }] : []}
          onChange={(data) => {
            setB1Data(data);
            // Optional: Auto-save as draft
            // handleAutoSave(FormType.GENERAL_INFO_B1, data);
          }}
        />
      )}
      {activeTab === "b2" && (
        <Form
          title={formMetadata.b2.title}
          subtitle={formMetadata.b2.subtitle}
          items={b2FormItemsWithValues} // Use memoized version
          onSubmit={handleB2Submit}
          submitButtonText={formMetadata.b2.submitButtonText}
          loading={loading}
          errors={error ? [{ field: "general", message: error, code: "GENERAL_ERROR" }] : []}
          onChange={(data) => {
            setB2Data(data);
            // Optional: Auto-save as draft
            // handleAutoSave(FormType.GENERAL_INFO_B2, data);
          }}
        />
      )}
    </TabContainer>
  );
}
