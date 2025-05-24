"use client";
import { useState } from "react";
import TabContainer, { TabConfig } from "@/components/ui/TabContainer";
import { useTabs } from "@/hooks/useTabs";
import Form from "@/components/forms/Form";
import { b1FormItems, b2FormItems, formMetadata } from "@/constants/formData";

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
  // Individual tab data states
  const [b1Data, setB1Data] = useState<Record<string, string>>({});
  const [b2Data, setB2Data] = useState<Record<string, string>>({});

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

  // Tab submission handlers
  const handleB1Submit = (data: Record<string, string>) => handleTabSubmit("b1", data, "b2");

  const handleB2Submit = (data: Record<string, string>) => {
    handleTabSubmit("b2", data);
    console.log("Complete General Information data:", { ...b1Data, ...data });
  };

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
          items={b1FormItems.map((item) => ({ ...item, value: b1Data[item.id] || "" }))}
          onSubmit={handleB1Submit}
          submitButtonText={formMetadata.b1.submitButtonText}
        />
      )}

      {activeTab === "b2" && (
        <Form
          title={formMetadata.b2.title}
          subtitle={formMetadata.b2.subtitle}
          items={b2FormItems.map((item) => ({ ...item, value: b2Data[item.id] || "" }))}
          onSubmit={handleB2Submit}
          submitButtonText={formMetadata.b2.submitButtonText}
        />
      )}
    </TabContainer>
  );
}
