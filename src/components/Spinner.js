import React from "react";
import spinner from "./spinner.gif";
const Spinner = () => {
  return (
    <div className="w-full flex justify-center items-center h-full mt-20">
      <div
        className="spinner-border text-light text-center h-20 w-20"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
