"use client";
import React, { useEffect, useState } from "react";

interface AlertProps {
  type: "success" | "danger";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setVisible(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  // if (!visible) return null;

  // CSS classes for animations
  const slideInClasses = "translate-y-0 opacity-100";
  const slideOutClasses = "translate-y-[-100%] opacity-0";

  const baseClasses = "p-3 rounded-md text-sm font-semibold mb-4 max-w-xs mx-auto transition-transform transition-opacity duration-300";
  const successClasses = "bg-green-400 text-green-100";
  const dangerClasses = "bg-red-400 text-red-100";

  const classes = `${baseClasses} ${type === "success" ? successClasses : dangerClasses} ${
    visible ? slideInClasses : slideOutClasses
  }`;

  return (
    <div
      className={classes}
      style={{
        position: "fixed",
        top: "20px", 
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default Alert;
