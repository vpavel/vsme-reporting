"use client";
import { useState } from "react";
import TabContainer, { TabConfig } from "@/components/ui/TabContainer";
import { useTabs } from "@/hooks/useTabs";
import Form from "@/components/forms/Form";
import { b11FormItems, formMetadata } from "@/constants/formData";

type GovernanceTab = "b11";

// Tab configuration
const governanceTabs: TabConfig<GovernanceTab>[] = [
  {
    key: "b11",
    fullName: "B11 - Convictions and fines for corruption and bribery",
    displayName: "B11 - Convictions and fines for corruption and bribery",
  },
];

export default function GovernancePage() {
  // Individual tab data states
  const [b11Data, setB11Data] = useState<Record<string, string>>({});

  // Tab management with custom hook
  const { activeTab, changeTab, getTabCompletion, calculateProgress, handleTabSubmit } = useTabs<GovernanceTab>({
    initialTab: "b11",
    tabData: { b11: b11Data },
    setTabData: { b11: setB11Data },
  });

  // Add completion status to tabs
  const tabsWithCompletion = governanceTabs.map((tab) => ({
    ...tab,
    isCompleted: getTabCompletion(tab.key),
  }));

  // Calculate progress
  const progress = calculateProgress(["b11"]);
  const progressText = progress.isComplete
    ? "Governance Section Complete!"
    : "Complete B11 to finish Governance section";

  // Tab submission handler
  const handleB11Submit = (data: Record<string, string>) => {
    handleTabSubmit("b11", data);
    console.log("Complete Governance data:", data);
  };

  return (
    <TabContainer<GovernanceTab>
      tabs={tabsWithCompletion}
      activeTab={activeTab}
      onTabChange={changeTab}
      title="Governance"
      subtitle="Report on your company's governance practices, including anti-corruption and anti-bribery compliance"
      progressPercentage={progress.percentage}
      progressText={progressText}
    >
      {/* Tab Content */}
      {activeTab === "b11" && (
        <Form
          title={formMetadata.b11.title}
          subtitle={formMetadata.b11.subtitle}
          items={b11FormItems.map((item) => ({ ...item, value: b11Data[item.id] || "" }))}
          onSubmit={handleB11Submit}
          submitButtonText={formMetadata.b11.submitButtonText}
        />
      )}
    </TabContainer>
  );
}
