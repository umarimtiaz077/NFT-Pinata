import React, { useState, useEffect, useContext } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { useRouter } from "next/router";
import axios from "axios";

// INTERNAL IMPORT
import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const UploadNFT = ({ uploadToIPFS, createNFT, uploadToPinata }) => {
  const { userId } = useContext(NFTMarketplaceContext); // Get userId from context
  const [userCollections, setUserCollections] = useState([]); // State for fetched collections
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [category, setCategory] = useState("");
  const [properties, setProperties] = useState("");
  const [image, setImage] = useState(null); // Uploaded image file
  const [defaultImage, setDefaultImage] = useState(null); // Default image (from query)

  const router = useRouter();
  const { mediaUrl } = router.query; // Retrieve mediaUrl from query parameters

  useEffect(() => {
    // Fetch user collections on component mount
    const fetchUserCollections = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/collection/user/${userId}`);
        setUserCollections(response.data.collections); // Populate user collections
      } catch (error) {
        console.error("Error fetching user collections:", error);
      }
    };

    if (userId) fetchUserCollections();
  }, [userId]);

  useEffect(() => {
    // Set the default image if mediaUrl is provided
    if (mediaUrl) {
      setDefaultImage(mediaUrl);
      setImage(mediaUrl); // Set the default image as the initial image
    }
  }, [mediaUrl]);

  const handleUpload = async () => {
    try {
      let imageToUpload = image;

      if (!imageToUpload) {
        alert("Please upload or select an image.");
        return;
      }

      console.log("Uploading image to IPFS/Pinata...");
      const imageUrl =
        typeof imageToUpload === "string" // Check if it's a URL (defaultImage)
          ? imageToUpload
          : await uploadToPinata(imageToUpload); // Upload file if it's a File object

      console.log("Image URL:", imageUrl);

      // Create NFT with the uploaded image URL
      if (imageUrl) {
        await createNFT(name, price, imageUrl, description, router);
      }
    } catch (error) {
      console.error("Error in handleUpload:", error);
    }
  };

  return (
    <div className={Style.upload}>
      {/* DropZone Section */}
      <DropZone
        title="JPG, PNG, WEBM, MAX 100MB"
        heading="Drag & drop file"
        subHeading="or Browse media on your device"
        name={name}
        website={website}
        description={description}
        royalties={royalties}
        fileSize={fileSize}
        category={category}
        properties={properties}
        setImage={setImage}
        uploadToIPFS={uploadToIPFS}
        uploadToPinata={uploadToPinata}
        defaultImage={defaultImage} // Pass the defaultImage for DropZone preview
      />

      {/* Form Section */}
      <div className={Style.upload_box}>
        {/* Row 1: Item Name and Website */}
        <div className={Style.upload_box_row}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="nft">Item Name</label>
            <input
              type="text"
              placeholder="Enter NFT name"
              className={formStyle.Form_box_input_userName}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="website">Website</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                type="text"
                placeholder="Website"
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Description</label>
          <textarea
            cols="30"
            rows="6"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Row 2: Royalties and File Size */}
        <div className={Style.upload_box_row}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="royalties">Royalties</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <FaPercent />
              </div>
              <input
                type="text"
                placeholder="20%"
                onChange={(e) => setRoyalties(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="fileSize">File Size</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <MdOutlineAttachFile />
              </div>
              <input
                type="text"
                placeholder="File size in MB"
                onChange={(e) => setFileSize(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Properties and Price */}
        <div className={Style.upload_box_row}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="properties">Properties</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Properties"
                onChange={(e) => setProperties(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="price">Price</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Price in ETH"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={Style.upload_box_btn}>
          <Button
            btnName="Upload"
            handleClick={handleUpload}
            classStyle={Style.upload_box_btn_style}
          />
          <Button
            btnName="Preview"
            handleClick={() => {}}
            classStyle={Style.upload_box_btn_style}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadNFT;
