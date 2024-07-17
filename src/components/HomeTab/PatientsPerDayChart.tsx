import React, { useEffect, useState } from "react";
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
const PatientsPerDayChart = ({ patientsCollection, loader }: any) => {
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const fetchPatientVisitData = async () => {
    const visitData: { [key: string]: { [key: string]: number } } = {};
    const monthSet: Set<string> = new Set();

    patientsCollection.forEach((doc: any) => {
      const data = doc;
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
    fetchPatientVisitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, patientsCollection]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="rounded-md w-full border-2 p-2 sm:p-4 lg:p-6 border-gray-400/70 bg-white relative">
      {loader ? (
        <div className=" bg-custom-gradient bg-gray-300/70 skeleton h-8 md:h-9 w-full rounded-sm"></div>
      ) : (
        <div className="mb-2 flex flex-row justify-between items-center">
          <h1 className="text-base md:text-xl font-bold text-gray-700">
            Patients Per Day
          </h1>
          <select
            id="month"
            name="month"
            className="form-select block pl-2 py-0 pr-10 text-gray-800/60 text-sm md:text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
      )}
      {loader ? (
        <div
          className="absolute flex flex-1 bottom-2 sm:bottom-4 lg:bottom-6
       bg-custom-gradient bg-gray-200 skeleton rounded-sm
      h-[calc(100%-3.5rem)] sm:h-[calc(100%-4.5rem)] md:h-[calc(100%-4.75rem)] lg:h-[calc(100%-5.75rem)]
      w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-3rem)]
      "
        ></div>
      ) : (
        <></>
      )}
      <Bar
        className="max-h-[300px]"
        data={{
          ...chartData,
          datasets: chartData.datasets.map((dataset: any) => ({
            ...dataset,
            maxBarThickness: 20, // Adjust this value to make bars slimmer
            borderRadius: 2, // Adjust this value to round the bars
          })),
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // Ensure y-axis values are integers
                font: {
                  size: window.innerWidth < 640 ? 10 : 12, // Adjust font size for mobile view
                },
                color: loader ? "#fff" : "#666",
              },
            },
            x: {
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 8 : 12, // Adjust font size for mobile view
                },
                maxRotation: 0, // Prevent tilting in mobile view
                minRotation: 0, // Prevent tilting in mobile view
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PatientsPerDayChart;
