import React from "react";
import Button from "../../../../../../components/Button/Button";

interface CourseTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <Button
            key={tab}
            onClick={() => onTabChange(tab)}
            type="cancel"
            content={
              <>
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full height: 2px bg-blue-600 animate-in fade-in duration-200"></span>
                )}
              </>
            }
            additionalClass={`
              !relative !h-auto !w-auto 
              !rounded-none !border-none !bg-transparent !shadow-none
              !px-6 !py-3 !text-sm !font-medium !transition-colors
              ${
                isActive
                  ? "!text-blue-600"
                  : "!text-gray-500 hover:!text-gray-700"
              }
            `}
          />
        );
      })}
    </div>
  );
};

export default CourseTabs;
