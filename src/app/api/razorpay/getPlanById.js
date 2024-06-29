import { NextResponse } from "next/server";
const getPlanById = async (subId) => {
  const plans = await fetch(
    "https://backend.dardibook.in/getPlansById",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ id: subId }),
    }
  );
  const parsedPlan = await plans.json();
  return NextResponse.json(parsedPlan);
};

export default getPlanById;
