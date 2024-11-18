import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from "react-icons/ti";
import Style from "./AuthorTaps.module.css";

const UserTaps = ({ activeTab, onTabClick }) => {
  const [openList, setOpenList] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Most Recent");

  const listArray = [
    "Created By Admin",
    "Most Appreciated",
    "Most Discussed",
    "Most Viewed",
  ];

  const openDropDownList = () => setOpenList(!openList);

  return (
    <div className={Style.AuthorTaps}>
      <div className={Style.AuthorTaps_box}>
        <div className={Style.AuthorTaps_box_left}>
          <div className={Style.AuthorTaps_box_left_btn}>
            {["Created NFT",  "Following", "Followers"].map((tab, index) => (
              <button
                key={index}
                className={`${activeTab === tab ? Style.active : ""}`}
                onClick={() => onTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default UserTaps;
