"use client";
import { useState } from "react";
import Sidebar from "@/components/landingPageLayout/Sidebar";
import MenuBarMobile from "@/components/landingPageLayout/MenuBarMobile";

const Navigation = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <MenuBarMobile setter={setShowSidebar} />
      <Sidebar show={showSidebar} setter={setShowSidebar} />
    </>
  );
};

export default Navigation;
