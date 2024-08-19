import { NextResponse } from "next/server";

const getPlans = async () => {
  const plans = await fetch("https://backend.dardibook.in/allPlans", {
    method: "GET",
    headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
  });

  
  const parsedPlans = await plans.json();
  return NextResponse.json(parsedPlans);
};

export default getPlans;
