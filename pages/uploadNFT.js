import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

// INTERNAL IMPORT
import Style from "../styles/upload-nft.module.css";
import { UploadNFT } from "../UploadNFT/uploadNFTIndex";

// SMART CONTRACT IMPORT
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const UploadNFTPage = () => {
  const { uploadToIPFS, createNFT, uploadToPinata } = useContext(
    NFTMarketplaceContext
  );

  const router = useRouter();
  const { mediaUrl } = router.query; // Retrieve the mediaUrl from the query
  const [defaultImage, setDefaultImage] = useState(null);

  useEffect(() => {
    if (mediaUrl) {
      setDefaultImage(mediaUrl); // Set the default image from the query
    }
  }, [mediaUrl]);

  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Create New NFT</h1>
          <p>
            You can set a preferred display name, create your profile URL, and
            manage other personal settings.
          </p>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Image, Video, Audio, or 3D Model</h2>
          <p>
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Max size: 100 MB
          </p>
        </div>

        <div className={Style.uploadNFT_box_form}>
          <UploadNFT
            uploadToIPFS={uploadToIPFS}
            createNFT={createNFT}
            uploadToPinata={uploadToPinata}
            defaultImage={defaultImage} // Pass the defaultImage to the component
          />
        </div>
      </div>
    </div>
  );
};

export default UploadNFTPage;
