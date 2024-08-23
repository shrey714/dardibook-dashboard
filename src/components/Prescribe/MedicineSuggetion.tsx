import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Loader from "../common/Loader";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAppSelector } from "@/redux/store";

const MedicineSuggestion = ({ medicine, rowId, handleInputChange }: any) => {
  const [suggestions, setSuggestions] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [openDropDown, setopenDropDown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const user = useAppSelector<any>((state) => state.auth.user);

  const debounceSearch = useCallback(
    (term: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = window.setTimeout(async () => {
        if (term.length > 2) {
          setLoading(true);
          setError(null);
          setopenDropDown(true);
          try {
            // Firestore query
            const medicinesRef = collection(
              db,
              "doctor",
              user?.uid,
              "medicinesData"
            );
            const q = query(
              medicinesRef,
              where("medicineName", ">=", term),
              where("medicineName", "<=", term + "\uf8ff")
            );
            const querySnapshot = await getDocs(q);

            const fetchedSuggestions = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setSuggestions(fetchedSuggestions);
            console.log("fetchedSuggestions==", fetchedSuggestions);
          } catch (error) {
            console.error("Search error:", error);
            setError("An error occurred while searching. Please try again.");
          } finally {
            setLoading(false);
          }
        } else {
          setSuggestions([]);
        }
      }, 300);
    },
    [user?.uid]
  );

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]); //api is not working for now

  const handleSuggestionClick = (val: any) => {
    console.log("clicked");
    handleInputChange(rowId, {
      target: {
        name: "medicineName",
        value: val.medicineName,
      },
    });
    setSearchTerm("");
    setSuggestions([]);
    setFocusedIndex(-1);
    setopenDropDown(false);
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
      <div className={`dropdown w-full ${openDropDown?"dropdown-open":""}`}>
        <div tabIndex={rowId} role="button" className="">
          </div>
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
            autoComplete="new-off"
          />
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
            {suggestions.map((suggestion: any, index: number) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`my-[1px] ${
                  index === focusedIndex ? "bg-gray-400/40 rounded-lg" : ""
                }`}
              >
                <a className="py-1 text-gray-800">{suggestion.medicineName}</a>
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
