import { format } from "date-fns";
import React from "react";

const FooterLine = () => {
  return (
    <div className="mb-3 mx-auto max-w-4xl px-3 pb-2 md:px-8 text-center">
      <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500 mx-3">
        © {format(new Date(), "yyyy")} dardibook.in. All rights reserved.
      </p>
    </div>
  );
};

export default FooterLine;
