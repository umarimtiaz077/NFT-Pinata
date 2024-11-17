import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext.js";
import axios from "axios";

// INTERNAL IMPORTS
import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";

const UloadNFT = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  // Access `userId` from context
  const { userId } = useContext(NFTMarketplaceContext);

  // Function to create a collection
  const createCollection = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      // Append the file if available
      if (image) {
        formData.append("file", image);
      }

      // Append userId to the formData
      formData.append("userId", userId);

      // Send the POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/collection/create-collection",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Redirect on successful creation
      if (response.status === 201) {
        console.log("resonce okay")
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  return (
    <div className={Style.upload}>
      <DropZone
        title="JPG, PNG, WEBM , MAX 100MB"
        heading="Drag & drop file"
        subHeading="or Browse media on your device"
        setImage={setImage} // Set image from DropZone
      />

      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="collectionName">Collection Name</label>
          <input
            type="text"
            placeholder="Sports Collection"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            cols="30"
            rows="6"
            placeholder="Something about Collection in a few words"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p>The description will be included on the collection detail page underneath its image.</p>
        </div>

        <div className={Style.upload_box_btn}>
          <Button
            btnName="Create Collection"
            handleClick={createCollection}
            classStyle={Style.upload_box_btn_style}
          />
          <Button
            btnName="Preview"
            handleClick={() => { }}
            classStyle={Style.upload_box_btn_style}
          />
        </div>
      </div>
    </div>
  );
};

export default UloadNFT;
