import React from "react";
import Image from "next/image";
import { TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";

// INTERNAL IMPORT
import Style from "./collectionProfile.module.css";

const CollectionProfile = ({ collection }) => {
  return (
    <div className={Style.collectionProfile}>
      <div className={Style.collectionProfile_box}>
        <div className={Style.collectionProfile_box_left}>
          <Image
            src={collection.image || "/placeholder-image.jpg"} // Display the collection's image
            alt="Collection Image"
            width={800}
            height={800}
            className={Style.collectionProfile_box_left_img}
          />
        </div>

        <div className={Style.collectionProfile_box_middle}>
          <h1>{collection.name || "Unnamed Collection"}</h1>
          <p>{collection.description || "No description provided."}</p>
          <div className={Style.collectionProfile_box_social}>
            {/* Social Media Icons */}
            <TiSocialFacebook />
            <TiSocialTwitter />
            <TiSocialLinkedin />
            <TiSocialInstagram />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionProfile;
