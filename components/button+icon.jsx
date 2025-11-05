import React from "react";

export default function ButtonPlusIcon({ text, icon, onClick, style, className }) {
  return (
    <button
      className={`${className} rounded-[40px] cursor-pointer text-sm px-5 py-3 border border-transparent flex items-center `}
      style={style}
      onClick={onClick}
    >
      <span>{text}</span>
      {/* Render the icon if provided */}
      {icon && <span className="icon">{icon}</span>}{" "}
    </button>
  );
}
