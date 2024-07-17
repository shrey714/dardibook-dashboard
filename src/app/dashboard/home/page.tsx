"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAppSelector } from "@/redux/store";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const fetchPatientVisitData = async (doctorId: string) => {
    const patientsCollection = collection(db, "doctor", doctorId, "patients");
    const snapshot = await getDocs(patientsCollection);
    const visitData: { [key: string]: { [key: string]: number } } = {};
    const monthSet: Set<string> = new Set();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const array = data.visitedDates || [data.last_visited];
      if (array) {
        array.forEach((timestamp: number) => {
          const date = new Date(timestamp);
          const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
          const monthOnly = formattedDate.slice(0, 7); // Get YYYY-MM
          const dayOnly = formattedDate.slice(8, 10); // Get DD
          monthSet.add(monthOnly);
          if (!visitData[monthOnly]) {
            visitData[monthOnly] = {};
          }
          if (!visitData[monthOnly][dayOnly]) {
            visitData[monthOnly][dayOnly] = 0;
          }
          visitData[monthOnly][dayOnly]++;
        });
      }
    });

    setAvailableMonths(Array.from(monthSet).sort((a, b) => b.localeCompare(a)));

    if (!selectedMonth && monthSet.size > 0) {
      setSelectedMonth(
        Array.from(monthSet).sort((a, b) => b.localeCompare(a))[0]
      );
    }

    if (selectedMonth) {
      const daysInMonth = new Date(
        parseInt(selectedMonth.split("-")[0]),
        parseInt(selectedMonth.split("-")[1]),
        0
      ).getDate();
      const labels = Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      ); // Generate 01 to 30/31

      const data = labels.map(
        (label) => visitData[selectedMonth]?.[label] || 0
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Number of Patients",
            data,
            backgroundColor: "rgba(74, 0, 255,0.5)",
            borderColor: "rgba(74, 0, 255,1)",
            borderWidth: 1,
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (userInfo?.uid) {
      fetchPatientVisitData(userInfo.uid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, selectedMonth]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="p-2 pt-[50px] md:p-8 relative min-h-screen">
      <div className="mb-2">
        <label
          htmlFor="month"
          className="block text-sm font-bold text-gray-700"
        >
          Select Month
        </label>
        <select
          id="month"
          name="month"
          className="mt-1 block w-full pl-1 pr-10 text-gray-800/60 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="container mx-auto">
        <h1 className="text-xl font-bold mb-2 text-gray-700">Patients Per Day</h1>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1, // Ensure y-axis values are integers
                },
              },
              x: {
                ticks: {
                  font: {
                    size: window.innerWidth < 640 ? 10 : 12, // Adjust font size for mobile view
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Home;
