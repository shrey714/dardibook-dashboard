"use client";

import { useAppSelector } from "../redux/store";
import LandingPage from "./landingPage/layout/page";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="full-screen">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }
  return (
    <div>
      <LandingPage />
    </div>
  );
};

export default Home;
