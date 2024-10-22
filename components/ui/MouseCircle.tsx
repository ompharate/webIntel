"use client";
import { useEffect, useState } from "react";

const MouseCircle = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    
    setIsActive(true);

    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      className={`fixed pointer-events-none rounded-full transition-colors duration-300 ${
        isActive ? "bg-[#333]" : "bg-[#ffffff] opacity-50"
      }`}
      style={{
        width: "50px",
        height: "50px",
        left: mousePosition.x - 25,
        top: mousePosition.y - 25,
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
      }}
    />
  );
};

export default MouseCircle;
