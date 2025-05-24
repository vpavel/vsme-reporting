"use client";
import { useState } from "react";
import TabContainer, { TabConfig } from "@/components/ui/TabContainer";
import { useTabs } from "@/hooks/useTabs";
import Form from "@/components/forms/Form";
import { b8FormItems, b9FormItems, b10FormItems, formMetadata } from "@/constants/formData";

type SocialTab = "b8" | "b9" | "b10";

// Tab configuration
const socialTabs: TabConfig<SocialTab>[] = [
  {
    key: "b8",
    fullName: "B8 - Workforce General Characteristics",
    displayName: "B8 - Workforce General Characteristics",
  },
  {
    key: "b9",
    fullName: "B9 - Workforce Health and Safety",
    displayName: "B9 - Workforce Health and Safety",
  },
  {
    key: "b10",
    fullName: "B10 - Workforce Remuneration, Collective Bargaining and Training",
    displayName: "B10 - Workforce Remuneration, Collective Bargaining...",
  },
];

export default function SocialPage() {
  // Individual tab data states
  const [b8Data, setB8Data] = useState<Record<string, string>>({});
  const [b9Data, setB9Data] = useState<Record<string, string>>({});
  const [b10Data, setB10Data] = useState<Record<string, string>>({});

  // Tab management with custom hook
  const { activeTab, changeTab, getTabCompletion, calculateProgress, handleTabSubmit } = useTabs<SocialTab>({
    initialTab: "b8",
    tabData: { b8: b8Data, b9: b9Data, b10: b10Data },
    setTabData: { b8: setB8Data, b9: setB9Data, b10: setB10Data },
  });

  // Add completion status to tabs
  const tabsWithCompletion = socialTabs.map((tab) => ({
    ...tab,
    isCompleted: getTabCompletion(tab.key),
  }));

  // Calculate progress
  const progress = calculateProgress(["b8", "b9", "b10"]);
  const progressText = progress.isComplete
    ? "Social Section Complete!"
    : `${progress.completed}/${progress.total} sections completed`;

  // Tab submission handlers
  const handleB8Submit = (data: Record<string, string>) => handleTabSubmit("b8", data, "b9");

  const handleB9Submit = (data: Record<string, string>) => handleTabSubmit("b9", data, "b10");

  const handleB10Submit = (data: Record<string, string>) => {
    handleTabSubmit("b10", data);
    console.log("Complete Social data:", {
      ...b8Data,
      ...b9Data,
      ...data,
    });
  };

  return (
    <TabContainer<SocialTab>
      tabs={tabsWithCompletion}
      activeTab={activeTab}
      onTabChange={changeTab}
      title="Social"
      subtitle="Report on your company's social responsibility, including workforce characteristics, health & safety, and employee well-being"
      progressPercentage={progress.percentage}
      progressText={progressText}
    >
      {/* Tab Content */}
      {activeTab === "b8" && (
        <Form
          title={formMetadata.b8.title}
          subtitle={formMetadata.b8.subtitle}
          items={b8FormItems.map((item) => ({ ...item, value: b8Data[item.id] || "" }))}
          onSubmit={handleB8Submit}
          submitButtonText={formMetadata.b8.submitButtonText}
        />
      )}

      {activeTab === "b9" && (
        <Form
          title={formMetadata.b9.title}
          subtitle={formMetadata.b9.subtitle}
          items={b9FormItems.map((item) => ({ ...item, value: b9Data[item.id] || "" }))}
          onSubmit={handleB9Submit}
          submitButtonText={formMetadata.b9.submitButtonText}
        />
      )}

      {activeTab === "b10" && (
        <Form
          title={formMetadata.b10.title}
          subtitle={formMetadata.b10.subtitle}
          items={b10FormItems.map((item) => ({ ...item, value: b10Data[item.id] || "" }))}
          onSubmit={handleB10Submit}
          submitButtonText={formMetadata.b10.submitButtonText}
        />
      )}
    </TabContainer>
  );
}
