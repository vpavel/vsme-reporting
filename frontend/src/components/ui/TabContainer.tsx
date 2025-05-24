"use client";
import { ReactNode } from "react";
import styles from "./TabContainer.module.css";

export interface TabConfig<T = string> {
  key: T;
  fullName: string;
  displayName: string;
  isCompleted?: boolean;
}

interface TabContainerProps<T extends string> {
  tabs: TabConfig<T>[];
  activeTab: T;
  onTabChange: (tabKey: T) => void;
  children: ReactNode;
  title: string;
  subtitle: string;
  progressPercentage?: number;
  progressText?: string;
}

export default function TabContainer<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  children,
  title,
  subtitle,
  progressPercentage = 0,
  progressText = "",
}: TabContainerProps<T>) {
  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.pageSubtitle}>{subtitle}</p>
      </div>

      {/* Bookmark-style Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => onTabChange(tab.key)}
              title={tab.fullName}
            >
              <span className={styles.tabText}>{tab.displayName}</span>
              <div className={styles.tabTooltip}>{tab.fullName}</div>
              {tab.isCompleted && <span className={styles.completeBadge}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Container */}
      <div className={styles.tabContent}>{children}</div>

      {/* Progress Indicator */}
      {progressText && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className={styles.progressText}>{progressText}</span>
        </div>
      )}
    </div>
  );
}
