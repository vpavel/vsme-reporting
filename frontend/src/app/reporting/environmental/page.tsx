"use client";
import { useState } from "react";
import TabContainer, { TabConfig } from "@/components/ui/TabContainer";
import { useTabs } from "@/hooks/useTabs";
import Form from "@/components/forms/Form";
import { b3FormItems, b4FormItems, b5FormItems, b6FormItems, b7FormItems, formMetadata } from "@/constants/formData";

type EnvironmentalTab = "b3" | "b4" | "b5" | "b6" | "b7";

// Tab configuration
const environmentalTabs: TabConfig<EnvironmentalTab>[] = [
  {
    key: "b3",
    fullName: "B3 - Energy and GHG Emissions",
    displayName: "B3 - Energy and GHG Emissions",
  },
  {
    key: "b4",
    fullName: "B4 - Pollution of Air, Water and Soil",
    displayName: "B4 - Pollution of Air, Water and Soil",
  },
  {
    key: "b5",
    fullName: "B5 - Biodiversity",
    displayName: "B5 - Biodiversity",
  },
  {
    key: "b6",
    fullName: "B6 - Water",
    displayName: "B6 - Water",
  },
  {
    key: "b7",
    fullName: "B7 - Resource Use, Circular Economy and Waste Management",
    displayName: "B7 - Resource Use, Circular Economy...",
  },
];

export default function EnvironmentalPage() {
  // Individual tab data states
  const [b3Data, setB3Data] = useState<Record<string, string>>({});
  const [b4Data, setB4Data] = useState<Record<string, string>>({});
  const [b5Data, setB5Data] = useState<Record<string, string>>({});
  const [b6Data, setB6Data] = useState<Record<string, string>>({});
  const [b7Data, setB7Data] = useState<Record<string, string>>({});

  // Tab management with custom hook
  const { activeTab, changeTab, getTabCompletion, calculateProgress, handleTabSubmit } = useTabs<EnvironmentalTab>({
    initialTab: "b3",
    tabData: { b3: b3Data, b4: b4Data, b5: b5Data, b6: b6Data, b7: b7Data },
    setTabData: { b3: setB3Data, b4: setB4Data, b5: setB5Data, b6: setB6Data, b7: setB7Data },
  });

  // Add completion status to tabs
  const tabsWithCompletion = environmentalTabs.map((tab) => ({
    ...tab,
    isCompleted: getTabCompletion(tab.key),
  }));

  // Calculate progress
  const progress = calculateProgress(["b3", "b4", "b5", "b6", "b7"]);
  const progressText = progress.isComplete
    ? "Environmental Section Complete!"
    : `${progress.completed}/${progress.total} sections completed`;

  // Tab submission handlers
  const handleB3Submit = (data: Record<string, string>) => handleTabSubmit("b3", data, "b4");

  const handleB4Submit = (data: Record<string, string>) => handleTabSubmit("b4", data, "b5");

  const handleB5Submit = (data: Record<string, string>) => handleTabSubmit("b5", data, "b6");

  const handleB6Submit = (data: Record<string, string>) => handleTabSubmit("b6", data, "b7");

  const handleB7Submit = (data: Record<string, string>) => {
    handleTabSubmit("b7", data);
    // Log complete environmental data
    console.log("Complete Environmental data:", {
      ...b3Data,
      ...b4Data,
      ...b5Data,
      ...b6Data,
      ...data,
    });
  };

  return (
    <TabContainer<EnvironmentalTab>
      tabs={tabsWithCompletion}
      activeTab={activeTab}
      onTabChange={changeTab}
      title="Environmental"
      subtitle="Report on your company's environmental impact, including energy, emissions, biodiversity, water usage, and waste management"
      progressPercentage={progress.percentage}
      progressText={progressText}
    >
      {/* Tab Content */}
      {activeTab === "b3" && (
        <Form
          title={formMetadata.b3.title}
          subtitle={formMetadata.b3.subtitle}
          items={b3FormItems.map((item) => ({ ...item, value: b3Data[item.id] || "" }))}
          onSubmit={handleB3Submit}
          submitButtonText={formMetadata.b3.submitButtonText}
        />
      )}

      {activeTab === "b4" && (
        <Form
          title={formMetadata.b4.title}
          subtitle={formMetadata.b4.subtitle}
          items={b4FormItems.map((item) => ({ ...item, value: b4Data[item.id] || "" }))}
          onSubmit={handleB4Submit}
          submitButtonText={formMetadata.b4.submitButtonText}
        />
      )}

      {activeTab === "b5" && (
        <Form
          title={formMetadata.b5.title}
          subtitle={formMetadata.b5.subtitle}
          items={b5FormItems.map((item) => ({ ...item, value: b5Data[item.id] || "" }))}
          onSubmit={handleB5Submit}
          submitButtonText={formMetadata.b5.submitButtonText}
        />
      )}

      {activeTab === "b6" && (
        <Form
          title={formMetadata.b6.title}
          subtitle={formMetadata.b6.subtitle}
          items={b6FormItems.map((item) => ({ ...item, value: b6Data[item.id] || "" }))}
          onSubmit={handleB6Submit}
          submitButtonText={formMetadata.b6.submitButtonText}
        />
      )}

      {activeTab === "b7" && (
        <Form
          title={formMetadata.b7.title}
          subtitle={formMetadata.b7.subtitle}
          items={b7FormItems.map((item) => ({ ...item, value: b7Data[item.id] || "" }))}
          onSubmit={handleB7Submit}
          submitButtonText={formMetadata.b7.submitButtonText}
        />
      )}
    </TabContainer>
  );
}
