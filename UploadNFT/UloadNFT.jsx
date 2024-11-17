import React, { useState, useEffect, useContext } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

// INTERNAL IMPORT
import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const UploadNFT = ({ uploadToIPFS, createNFT, uploadToPinata }) => {
  const { userId, walletAddress } = useContext(NFTMarketplaceContext); // Get userId from context
  const [categoryArry, setUserCollections] = useState([]); // State for fetched collections
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [category, setCategory] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [properties, setProperties] = useState("");
  const [image, setImage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Fetch user collections on component mount
    const fetchUserCollections = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/collection/user/${userId}`
        );
        setUserCollections(response.data.collections); // Populate user collections
      } catch (error) {
        console.error("Error fetching user collections:", error);
      }
    };

    if (userId) fetchUserCollections();
  }, [userId]);

  const handleUpload = async () => {
    try {
      // Step 1: Upload the image to IPFS/Pinata
      if (!image) {
        setError("Image file is missing.");
        setOpenError(true);
        return;
      }

      console.log("Uploading image to IPFS/Pinata...");
      const imageUrl = await uploadToPinata(image); // Upload the image file
      console.log("Image URL:", imageUrl);

      // Step 2: Create NFT with the returned image URL
      if (imageUrl) {
        await createNFT(name, price, image, description, router, website, royalties, fileSize, category,category_id, properties, walletAddress); // Pass the URL
      }
    } catch (error) {
      console.error("Error in handleUpload:", error);
    }
  };

  return (
    <div className={Style.upload}>
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
      />

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

        {/* Description Field (Full Width) */}
        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Description</label>
          <textarea
            cols="30"
            rows="6"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p>The description will be included on the item's detail page.</p>
        </div>

        <div className={Style.upload_box_slider_div}>
          {categoryArry.map((el, i) => (
            <div
              className={`${Style.upload_box_slider} ${
                active == i + 1 ? Style.active : ""
              }`}
              key={i + 1}
              onClick={() => (setActive(i + 1), setCategory(el.name), setCategoryId(el._id))}
            >
              <div className={Style.upload_box_slider_box}>
                <div className={Style.upload_box_slider_box_img}>
                  <Image
                    src={el.image}
                    alt="background image"
                    width={70}
                    height={70}
                    className={Style.upload_box_slider_box_img_img}
                  />
                </div>
                <div className={Style.upload_box_slider_box_img_icon}>
                  <TiTick />
                </div>
              </div>
              <p>{el.name} </p>
            </div>
          ))}
        </div>
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
          handleClick={handleUpload} // Call handleUpload on click
          classStyle={Style.upload_box_btn_style}
        />
        <Button
          btnName="Preview"
          handleClick={() => {}}
          classStyle={Style.upload_box_btn_style}
        />
      </div>
    </div>
  );
};

export default UploadNFT;
