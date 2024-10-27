import React from "react";
import { Button } from "./button";

const Navbar = () => {
  return (
    <div className="bg-[#09090B] flex justify-between items-start p-4">
      <h1 className="text-2xl font-semibold text-white">WebIntel</h1>
      <div className="flex items-start">
        <Button variant="outline" className="font-semibold">
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
