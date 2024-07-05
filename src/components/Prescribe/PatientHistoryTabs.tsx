import React from "react";

const PatientHistoryTabs = () => {
  return (
    <div
      role="tablist"
      className="tabs tabs-lifted w-full max-h-screen"
    >
      {["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 6"].map(
        (tab, key) => (
          <React.Fragment key={key}>
            <input
              key={key}
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="!w-max font-medium tab bg-transparent shadow-none outline-none  [--tab-border-color:transparent]"
              style={{ boxShadow: "none" }}
              aria-label={tab}
              defaultChecked={key === 5 ? true : false}
            />
            <div
              role="tabpanel"
              style={{ maxHeight: "calc(100vh - 2rem)" }}
              className="tab-content bg-white overflow-y-auto rounded-none p-6"
            >
              <div>Tab content {key}</div>
              <div>Tab content {key}</div>
              <div>Tab content {key}</div>
              <div>Tab content {key}</div>
              <div>Tab content {key}</div>
              <div>Tab content {key}</div>
              <div>Tab content {key}</div>

            </div>
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default PatientHistoryTabs;
