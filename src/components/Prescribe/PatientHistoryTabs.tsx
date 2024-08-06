import React from "react";
import PatientHistoryData from "./PatientHistoryData";

const PatientHistoryTabs = ({ prescriptionsData }: any) => {
  return (
    <>
      {prescriptionsData?.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center py-5">
          No history available
        </div>
      ) : (
        <div role="tablist" className="tabs tabs-lifted w-full max-h-screen">
          {prescriptionsData?.map((history: any, key: number) => (
            <React.Fragment key={key}>
              <input
                key={key}
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="!w-max font-medium text-gray-900 tab [--tab-bg:white] shadow-none outline-none  [--tab-border-color:transparent]"
                style={{ boxShadow: "none" }}
                aria-label={new Date(history.time).toLocaleDateString("en-GB")}
                defaultChecked={
                  key === prescriptionsData?.length - 1 ? true : false
                }
              />
              <div
                role="tabpanel"
                style={{ maxHeight: "calc(100vh - 2rem)" }}
                className="tab-content bg-white overflow-y-auto rounded-none p-6"
              >
                <PatientHistoryData history={history} />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

export default PatientHistoryTabs;
