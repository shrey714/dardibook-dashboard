import React from "react";
import PatientHistoryData from "./PatientHistoryData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const PatientHistoryTabs = ({ prescriptionsData }: any) => {
  return (
    <>
      {prescriptionsData?.length === 0 ? (
        <div className="w-full flex items-center justify-center py-5">
          No history available
        </div>
      ) : (
        <Tabs defaultValue="0" className="w-full max-h-full sticky top-0">
          <TabsList className="w-full rounded-none sticky top-0">
            {prescriptionsData?.map((history: any, key: number) => (
              <TabsTrigger key={key} value={key.toString()}>
                {new Date(history.time).toLocaleDateString("en-GB")}
              </TabsTrigger>
            ))}
          </TabsList>
          {prescriptionsData?.map((history: any, key: number) => (
            <TabsContent
              key={key}
              value={key.toString()}
              className="bg-white p-6 m-2 rounded-md"
            >
              <PatientHistoryData history={history} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </>
  );
};

export default PatientHistoryTabs;
