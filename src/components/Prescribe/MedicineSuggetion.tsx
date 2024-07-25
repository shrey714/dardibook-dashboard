import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Loader from "../common/Loader";

const MedicineSuggestion = ({ medicine, rowId, handleInputChange }: any) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const debounceSearch = useCallback((term: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = window.setTimeout(() => {
      if (term.length > 2) {
        setLoading(true);
        setError(null);
        axios
          .get(`https://backend.dardibook.in/searchMedicine?q=${term}`)
          .then((response) => {
            setSuggestions(
              response.data.map((item: { name: string }) => item.name)
            );
            setLoading(false);
          })
          .catch((error) => {
            console.error("Search error:", error);
            setError("An error occurred while searching. Please try again.");
            setLoading(false);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  const handleSuggestionClick = (val: string) => {
    handleInputChange(rowId, {
      target: {
        name: "medicineName",
        value: val,
      },
    });
    setSearchTerm("");
    setSuggestions([]);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === "ArrowUp") {
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (event.key === "Enter" && focusedIndex >= 0) {
      event.preventDefault();
      handleSuggestionClick(suggestions[focusedIndex]);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && suggestionsRef.current) {
      const focusedElement = suggestionsRef.current.children[focusedIndex];
      if (focusedElement) {
        (focusedElement as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [focusedIndex]);

  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 100); // Delay to allow click event to register
  };

  return (
    <>
      <div className="dropdown w-full" onBlur={handleBlur}>
        <div tabIndex={rowId} role="button" className="">
          <input
            type="text"
            name="medicineName"
            value={medicine}
            onChange={(event) => {
              handleInputChange(rowId, event);
              setSearchTerm(event.currentTarget.value);
              setFocusedIndex(-1); // Reset focused index when input changes
            }}
            onKeyDown={handleKeyDown}
            className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {loading ? (
          <ul
            tabIndex={rowId}
            className="dropdown-content flex items-center bg-gray-300 menu mt-1 md:mt-2 rounded-lg z-[1] w-52 p-1 md:p-2 shadow"
          >
            <Loader
              size="small"
              color="text-primary"
              secondaryColor="text-white"
            />
          </ul>
        ) : suggestions.length > 0 ? (
          <ul
            ref={suggestionsRef}
            tabIndex={rowId}
            className="dropdown-content bg-gray-300 menu mt-1 md:mt-2 rounded-lg z-[1] w-52 p-1 md:p-2 shadow"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`my-[1px] ${
                  index === focusedIndex ? "bg-gray-400/40 rounded-lg" : ""
                }`}
              >
                <a className="py-1 text-gray-800">{suggestion}</a>
              </li>
            ))}
          </ul>
        ) : (
          error && <div className="text-red-500 mt-1">{error}</div>
        )}
      </div>
    </>
  );
};

export default MedicineSuggestion;
