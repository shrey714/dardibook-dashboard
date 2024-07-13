import React, { useRef } from "react";
import { List, arrayMove } from "react-movable";
import { ChevronUpDownIcon, EyeIcon } from "@heroicons/react/24/outline";

export const buttonStyles = {
  margin: "0px 4px 0px 4px",
  padding: "4px",
  width: "auto",
  overflow: "visible",
  cursor: "grab",
  background: "#CCC",
  borderRadius: "4px",
};

const ReOrderingList: React.FC = () => {
  const [items, setItems] = React.useState(
    Array.from(Array(100).keys()).map((val) => `${val}`)
  );
  const listRef = useRef<any>(null);
  const itemRefs = useRef<any[]>([]);
  const scrollToItem = (index: number) => {
    const list = listRef.current;
    const item = itemRefs.current[index];

    if (list && item) {
      list.scrollTo({
        top: item.offsetTop - list.offsetTop,
        behavior: "smooth",
      });
    }
  };
  //  scrollToItem(45)
  return (
    <>
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) => {
          setItems(arrayMove(items, oldIndex, newIndex));
        }}
        renderList={({ children, props, isDragged }) => {
          return (
            <ul
              {...props}
              // ref={listRef}
              style={{
                cursor: isDragged ? "grabbing" : undefined,
                maxHeight: "80vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {children}
            </ul>
          );
        }}
        renderItem={({ value, props, isDragged, isSelected, index }) => (
          <li
            {...props}
            // ref={(el) => (itemRefs.current[index] = el)}
            style={{
              ...props.style,
              padding: "4px 4px 4px 4px",
              margin: "0 0 0.25rem 0",
              listStyleType: "none",
              display: "flex",
              flexDirection: "row",
              // justifyContent: "space-between",
              alignItems: "center",
              border: "2px solid #CCC",
              color: "#333",
              borderRadius: "5px",
              backgroundColor: isDragged || isSelected ? "#EEE" : "#FFF",
            }}
          >
            <div className="rounded-md mx-1 aspect-square h-6 text-white text-center font-medium bg-black">
              {value}
            </div>
            <button
              className={`rounded-md mx-1 p-1 aspect-square h-6 ${
                value === "0" ? "bg-primary" : "bg-[#CCC]"
              }`}
              tabIndex={-1}
            >
              <EyeIcon className="size-4 text-black" />
            </button>
            <div className="flex mx-1 flex-1"> {value}</div>
            <button
              data-movable-handle
              style={{
                ...buttonStyles,
                cursor: isDragged ? "grabbing" : "grab",
              }}
              tabIndex={-1}
            >
              <ChevronUpDownIcon className="size-4 text-black" />
            </button>
          </li>
        )}
      />
    </>
  );
};

export default ReOrderingList;
