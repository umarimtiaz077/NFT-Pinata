import React from "react";
import Style from "./Button.module.css";

const Button = ({ btnName, handleClick, icon, classStyle, type = "button" }) => {
  return (
    <div className={Style.box}>
      <button
        className={`${Style.button} ${classStyle}`}
        onClick={handleClick} 
        type={type}
      >
        {icon} {btnName}
      </button>
    </div>
  );
};

export default Button;
