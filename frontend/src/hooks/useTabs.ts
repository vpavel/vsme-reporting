import { useState } from "react";

export interface UseTabsOptions<T extends string> {
  initialTab: T;
  tabData: Record<T, Record<string, string>>;
  setTabData: Record<T, (data: Record<string, string>) => void>;
}

export function useTabs<T extends string>({ initialTab, tabData, setTabData }: UseTabsOptions<T>) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  // Calculate completion status for each tab
  const getTabCompletion = (tabKey: T): boolean => {
    return Object.keys(tabData[tabKey] || {}).length > 0;
  };

  // Calculate overall progress
  const calculateProgress = (tabKeys: T[]) => {
    const completedTabs = tabKeys.filter(getTabCompletion).length;
    const totalTabs = tabKeys.length;
    const percentage = (completedTabs / totalTabs) * 100;

    return {
      completed: completedTabs,
      total: totalTabs,
      percentage,
      isComplete: completedTabs === totalTabs,
    };
  };

  // Handle tab submission with optional auto-advance
  const handleTabSubmit = (tabKey: T, data: Record<string, string>, nextTab?: T) => {
    setTabData[tabKey](data);
    console.log(`${tabKey} data saved:`, data);

    if (nextTab) {
      setActiveTab(nextTab);
    }
  };

  // Change tab manually
  const changeTab = (tabKey: T) => {
    setActiveTab(tabKey);
  };

  return {
    activeTab,
    setActiveTab,
    changeTab,
    getTabCompletion,
    calculateProgress,
    handleTabSubmit,
  };
}
