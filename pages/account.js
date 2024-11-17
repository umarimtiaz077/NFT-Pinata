import React, { useState, useCallback, useEffect,useContext } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import Form from "../AccountPage/Form/Form";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Account = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const { userId } = useContext(NFTMarketplaceContext);

  const onDrop = useCallback((acceptedFiles) => {
    setFileUrl(acceptedFiles[0]); // Set fileUrl as the first file in the accepted files
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
          const profileData = response.data;
          if (profileData.profileImage) {
            setFileUrl(profileData.profileImage); // Set profile image from DB if available
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImage();
  }, [userId]);

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile URL, and manage
          other personal settings.
        </p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={fileUrl ? (typeof fileUrl === "string" ? fileUrl : URL.createObjectURL(fileUrl)) : images.user1}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
          <Form fileUrl={fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default Account;
