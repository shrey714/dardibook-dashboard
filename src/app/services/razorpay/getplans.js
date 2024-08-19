import { NextResponse } from "next/server";

const getPlans = async () => {
  const plans = await fetch("https://backend.dardibook.in/allPlans", {
    method: "GET",
    headers: {
      // You can include any additional headers if needed
    },
  });

  
  const parsedPlans = await plans.json();
  return NextResponse.json(parsedPlans);
};

export default getPlans;
