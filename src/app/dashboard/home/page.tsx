import React from "react";
import PatientsPerDayChart from "@/components/HomeTab/PatientsPerDayChart";
import StatusBoxes from "@/components/HomeTab/StatusBoxes";
import Temp from "./temp";

const Home = () => {
  return (
    <div className="p-2 flex md:flex-col flex-col-reverse sm:p-4 md:p-6">
      <StatusBoxes />
      <PatientsPerDayChart />
      <Temp />
    </div>
  );
};

export default Home;
