"use client";

import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    "0": "#3DBDEC",
    "1.0": "#4a00ff",
  },
  shadowBlur: 10,
});

const TopBarLoader = () => {
  return <TopBarProgress />;
};

export default TopBarLoader;
