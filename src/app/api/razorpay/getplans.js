import { NextResponse } from "next/server";

const getPlans = async () => {
  const plans = await fetch(
    "https://backend.dardibook.in/allPlans"
  );
  const parsedPlans = await plans.json();
  return NextResponse.json(parsedPlans);
};

export default getPlans;
