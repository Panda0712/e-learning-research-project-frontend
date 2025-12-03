import Button from "../../../components/Button/Button";

export type TabType =
  | "Description"
  | "Lectures Notes"
  | "Attach File"
  | "Comments";

interface Props {
  tabs: TabType[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const LearningTabs = ({ tabs, activeTab, onTabChange }: Props) => {
  return (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onTabChange(tab)}
          content={
            <>
              {tab}
              {tab === "Attach File" && (
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded font-normal ${
                    activeTab === tab
                      ? "bg-blue-50 text-[#2580D5]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  01
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-2 bg-[#2580D5]"></div>
              )}
            </>
          }
          additionalClass={`
            !w-auto !h-auto !bg-transparent !rounded-none !border-0 
            !px-6 !py-4 !text-sm !font-semibold relative transition-colors
            ${
              activeTab === tab
                ? "!text-[#2580D5]"
                : "!text-gray-500 hover:!text-gray-700"
            }
          `}
        />
      ))}
    </div>
  );
};

export default LearningTabs;
