"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";

import { getAllPatients } from "@/app/services/getAllPatients";
import PatientsPerDayChart from "@/components/HomeTab/PatientsPerDayChart";
import StatusBoxes from "@/components/HomeTab/StatusBoxes";

const Home = () => {
  const user = useAppSelector<any>((state) => state.auth.user);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientsCollection, setpatientsCollection] = useState([]);
  useEffect(() => {
    const fetchPatients = async () => {
      if (user) {
        try {
          setLoader(true);
          const data = await getAllPatients(user.uid);
          if (data.data) {
            setLoader(false);
            setpatientsCollection(data.data);
          } else {
            setError("Error fetching patients");
          }
        } catch (error) {
          setError("Error fetching patients");
          setLoader(false);
        }
      }
    };

    fetchPatients();
  }, [user]);

  return (
    <div className="p-2 flex md:flex-col flex-col-reverse pt-[50px] sm:pt-[50px] sm:p-4 md:p-6">
      {error ? (
        error
      ) : (
        <>
          <StatusBoxes
            loader={loader}
            patientsCollection={patientsCollection}
          />
          <PatientsPerDayChart
            loader={loader}
            patientsCollection={patientsCollection}
          />
        </>
      )}
    </div>
  );
};

export default Home;
