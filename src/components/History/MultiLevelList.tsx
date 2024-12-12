import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
// Define the type for the item
interface Item {
  id: string;
  name: string;
  timestamp: number; // Timestamp in milliseconds
  mobile_number: string;
}

// Define the type for the fetched data
interface PatientData {
  first_name: string;
  id: string;
  last_name: string;
  age: number;
  gender: string;
  visitedDates: number[];
  last_visited: number;
  appointed: boolean;
  mobile_number: string;
}

function getUniqueDateTimestamps(
  last_visited: number,
  visitedDates: number[]
): number[] {
  // Combine last_visited and visitedDates
  const allTimestamps = [last_visited, ...(visitedDates || [])];

  // Create a Set to track unique dates
  const uniqueDates = new Set<string>();

  // Filter timestamps to ensure unique dates
  const uniqueTimestamps = allTimestamps.filter((timestamp) => {
    const date = new Date(timestamp).toISOString().split("T")[0]; // Convert to date string "YYYY-MM-DD"
    if (!uniqueDates.has(date)) {
      uniqueDates.add(date);
      return true;
    }
    return false;
  });

  return uniqueTimestamps;
}
// Transform the fetched data into the required format
const transformData = (data: PatientData[]): Item[] => {
  const items: Item[] = [];

  data.forEach((patient) => {
    const {
      first_name,
      last_name,
      id,
      last_visited,
      visitedDates,
      mobile_number,
    } = patient;
    const name = `${first_name} ${last_name}`;

    getUniqueDateTimestamps(last_visited, visitedDates).forEach((timestamp) => {
      items.push({ id, name, timestamp, mobile_number });
    });
  });

  return items;
};

// Group items by month and date, and sort by date
const groupItemsByMonthAndDate = (items: Item[]) => {
  // Sort items by timestamp in descending order (latest first)
  items.sort((a, b) => b.timestamp - a.timestamp);

  const grouped: { [key: string]: { [key: string]: Item[] } } = {};

  items.forEach((item) => {
    const date = new Date(item.timestamp);
    const monthYear = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const day = date.toLocaleString("default", { day: "numeric" });

    if (!grouped[monthYear]) {
      grouped[monthYear] = {};
    }
    if (!grouped[monthYear][day]) {
      grouped[monthYear][day] = [];
    }

    grouped[monthYear][day].push(item);
  });

  return grouped;
};

// Component to display the grouped items
const ItemList: React.FC<{ items: Item[] }> = ({ items }) => {
  const groupedItems = groupItemsByMonthAndDate(items);

  // Sort the months and days in descending order
  const sortedMonthYears = Object.keys(groupedItems).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="relative">
      <li className=" pl-[25%] lg:pl-[15%] z-10 top-6  w-full sticky py-1 list-none flex flex-row items-center font-semibold text-sm gap-1">
        <div className="min-w-6"></div>
        <div className="w-full text-center">ID</div>
        <div className="w-full">Name</div>
        <div className="w-full hide-between-768-and-990 hide-before-480">
          Mobile
        </div>
        <div className="min-w-6"></div>
      </li>
      {sortedMonthYears.map((monthYear, key) => (
        <div key={key}>
          <h2 className="z-[1] h-6 sticky top-0 w-full text-xs sm:text-sm bg-background">
            {monthYear}
          </h2>
          {Object.entries(groupedItems[monthYear])
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
            .map(([date, items]) => (
              <div key={date}>
                <div className="w-full py-1 z-[0] sticky top-6 bg-background">
                  <p className="text-xs sm:text-sm">
                    {`${date}th ${monthYear.split(" ")[0]}`} ({items.length})
                  </p>
                </div>

                <ul className="pl-[25%] lg:pl-[15%] p-[2px]">
                  {items.map((item, index) => (
                    <li
                      className="py-[2px] odd:bg-gray-400 w-full list-none flex flex-row items-center text-sm  gap-1 "
                      key={index}
                    >
                      <div className="min-w-6 text-center">{index + 1}</div>
                      <div className="w-full">{item.id}</div>
                      <div className="w-full">{item.name}</div>
                      <div className="w-full hide-between-768-and-990 hide-before-480">
                        {item.mobile_number}
                      </div>
                      <Link
                        href={{
                          pathname: "history/patientHistory",
                          query: { patientId: item.id },
                        }}
                        type="button"
                        className="min-w-6"
                      >
                        <ExternalLink className="size-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

// Main component
const App: React.FC<any> = ({ patients }: any) => {
  return (
    <div className="App">
      <ItemList items={transformData(patients)} />
    </div>
  );
};

export default App;
