import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

// INTERNAL IMPORT
import Style from "./DropZone.module.css";
import images from "../../img";

const DropZone = ({
  title,
  heading,
  subHeading,
  name,
  website,
  description,
  royalties,
  fileSize,
  category,
  properties,
  uploadToIPFS,
  uploadToPinata,
  setImage,
  defaultImage, // Accept the default image as a prop
}) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    // If a defaultImage is provided, set it as the initial fileUrl
    if (defaultImage) {
      setFileUrl(defaultImage);
      setImage(defaultImage); // Set the defaultImage as the initial image
    }
  }, [defaultImage, setImage]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const filePreviewUrl = URL.createObjectURL(file);
        setFileUrl(filePreviewUrl); // Set a preview URL for display
        setImage(file); // Pass the actual file back to the parent component
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.DropZone}>
      <div className={Style.DropZone_box} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={Style.DropZone_box_input}>
          {fileUrl ? (
            // If there's a file URL, display it as a preview
            <img
              src={fileUrl}
              alt="Selected file preview"
              width={100}
              height={100}
              className={Style.DropZone_box_input_img_img}
            />
          ) : (
            // If no file URL, display the default upload image
            <>
              <p>{title}</p>
              <div className={Style.DropZone_box_input_img}>
                <Image
                  src={images.upload}
                  alt="upload"
                  width={100}
                  height={100}
                  objectFit="contain"
                  className={Style.DropZone_box_input_img_img}
                />
              </div>
              <p>{heading}</p>
              <p>{subHeading}</p>
            </>
          )}
        </div>
      </div>

      {fileUrl && (
        <aside className={Style.DropZone_box_aside}>
          <div className={Style.DropZone_box_aside_box}>
            <img src={fileUrl} alt="NFT preview" width={200} height={200} />

            <div className={Style.DropZone_box_aside_box_preview}>
              <div className={Style.DropZone_box_aside_box_preview_one}>
                <p>
                  <samp>NFT Name:</samp>
                  {name || ""}
                </p>
                <p>
                  <samp>Website:</samp>
                  {website || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_two}>
                <p>
                  <span>Description:</span>
                  {description || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_three}>
                <p>
                  <span>Royalties:</span>
                  {royalties || ""}
                </p>
                <p>
                  <span>FileSize:</span>
                  {fileSize || ""}
                </p>
                <p>
                  <span>Properties:</span>
                  {properties || ""}
                </p>
                <p>
                  <span>Category:</span>
                  {category || ""}
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default DropZone;
