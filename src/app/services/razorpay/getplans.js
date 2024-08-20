import { NextResponse } from "next/server";

const getPlans = async () => {
  // const plans = await fetch("https://backend.dardibook.in/allPlans");
const plans = await fetch('https://backend.dardibook.in/allPlans', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // You can also add any authorization headers if needed
          },
          credentials: 'omit', // Allows sending cookies along with the request if needed
        });
  
  const parsedPlans = await plans.json();
  return NextResponse.json(parsedPlans);
};

export default getPlans;
