import React from "react";

// Define the type for the item
interface Item {
  id: number;
  name: string;
  timestamp: number;
}

// Generate a list of items with random data
const generateItems = (numItems: number): Item[] => {
  const items: Item[] = [];
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
  ];

  for (let i = 0; i < numItems; i++) {
    items.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      timestamp:
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000), // Random timestamp within the last year
    });
  }

  return items;
};
const printlist = () => {
  console.log(generateItems(50));
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
    <div>
      {sortedMonthYears.map((monthYear) => (
        <div key={monthYear}>
          <h2 className="z-[1] h-10 pt-4 sticky top-0 w-full bg-gray-300 text-gray-800">
            {monthYear}
          </h2>
          {Object.entries(groupedItems[monthYear])
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
            .map(([date, items]) => (
              <div key={date}>
                <div className="w-full py-1 bg-gray-300 z-[0] sticky top-10">
                  <p className="text-gray-800 text-sm">{`${date}th ${
                    monthYear.split(" ")[0]
                  }`}</p>
                </div>

                <ul>
                  {items.map((item) => (
                    <li
                      className="p-1 mb-1 list-none flex flex-row items-center border-gray-800 border-[1.5px] color-[#333] rounded bg-white"
                      key={item.id}
                    >
                      {item.name}
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
const App: React.FC = () => {
  const items = generateItems(50);

  return (
    <div className="App">
      <ItemList items={items} />
    </div>
  );
};

export default App;
