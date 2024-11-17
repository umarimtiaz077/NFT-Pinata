import React, { useState } from "react";
import Image from "next/image";
import { MdVerified, MdCloudUpload, MdOutlineReportProblem } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { TiSocialFacebook, TiSocialInstagram, TiSocialTwitter } from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";

// INTERNAL IMPORT
import Style from "./AuthorProfileCard.module.css";
import { Button } from "../../components/componentsindex.js";
import images from "../../img"; // Import local images if needed

const AuthorProfileCard = ({ currentAccount, profileImage, username, description, socialLinks }) => {
  const [share, setShare] = useState(false);
  const [report, setReport] = useState(false);

  const copyAddress = () => {
    const copyText = document.getElementById("myInput");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };

  const openShare = () => {
    setShare((prev) => !prev);
    setReport(false);
  };

  const openReport = () => {
    setReport((prev) => !prev);
    setShare(false);
  };
  const handlecheck=()=>
  {
    console.log("this check method hit")
  };

  return (
    <div className={Style.AuthorProfileCard}>
      <div className={Style.AuthorProfileCard_box}>
        <div className={Style.AuthorProfileCard_box_img}>
          <Image
            src={profileImage || images.defaultProfile || "/default-profile.png"} // Fallback to a local image or default path
            className={Style.AuthorProfileCard_box_img_img}
            alt="Profile Image"
            width={220}
            height={220}
          />
        </div>

        <div className={Style.AuthorProfileCard_box_info}>
          <h2>
            {username || "Unnamed User"}{" "}
            <span>
              <MdVerified />
            </span>
          </h2>

          <div className={Style.AuthorProfileCard_box_info_address}>
            <input type="text" value={currentAccount} id="myInput" readOnly />
            <FiCopy
              onClick={copyAddress}
              className={Style.AuthorProfileCard_box_info_address_icon}
            />
          </div>

          <p>{description || "No description provided."}</p>

          <div className={Style.AuthorProfileCard_box_info_social}>
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <TiSocialFacebook />
              </a>
            )}
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <TiSocialInstagram />
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <TiSocialTwitter />
              </a>
            )}
          </div>
        </div>

        <div className={Style.AuthorProfileCard_box_share}>
          <Button btnName="Follow" handleClick={() => {handlecheck()}} />
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileCard;
