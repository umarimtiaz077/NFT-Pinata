import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { BsImages } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

// INTERNAL IMPORT
import Style from "./NFTDetailsImg.module.css";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NFTDetailsImg = ({ nft }) => {
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(true);
  const [countnft, setCountnft] = useState(0); // Default count to 0
  const [like, setLike] = useState(false); // State to track if user has liked the NFT

  const openDescription = () => {
    setDescription((prev) => !prev);
  };

  const openDetails = () => {
    setDetails((prev) => !prev);
  };

  const { likedNFT, unlikedNFT, checkNFTLiked } = useContext(NFTMarketplaceContext);

  // Fetch like count and initial like status
  const getNFTCount = () => {
    checkNFTLiked(nft.image)
      .then((result) => {
        if (result.success) {
          setCountnft(result.likeCount);
          setLike(result.hasLiked); // Set the initial like status
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  useEffect(() => {
    getNFTCount(); // Fetch data when the component mounts or `nft.image` changes
  }, [nft.image]);

  // Toggle like/unlike functionality
  const likeNFT = () => {
    if (!like) {
      likedNFT(nft.image)
        .then(() => {
          setLike(true);
          setCountnft((prevCount) => prevCount + 1); // Increment count when liked
        })
        .catch((error) => console.error("Error liking NFT:", error));
    } else {
      unlikedNFT(nft.image)
        .then(() => {
          setLike(false);
          setCountnft((prevCount) => prevCount - 1); // Decrement count when unliked
        })
        .catch((error) => console.error("Error unliking NFT:", error));
    }
  };

  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_box_NFT}>
          <div className={Style.NFTDetailsImg_box_NFT_like}>
            <BsImages className={Style.NFTDetailsImg_box_NFT_like_icon} />
            <p
              onClick={likeNFT}
              className={Style.NFTDetailsImg_box_NFT_like_container}
            >
              {like ? (
                <AiFillHeart className={Style.NFTDetailsImg_box_NFT_like_icon} />
              ) : (
                <AiOutlineHeart className={Style.NFTDetailsImg_box_NFT_like_icon} />
              )}
              <span>{countnft}</span> {/* Display updated like count */}
            </p>
          </div>

          <div className={Style.NFTDetailsImg_box_NFT_img}>
            <img
              src={nft.image}
              className={Style.NFTDetailsImg_box_NFT_img_img}
              alt="NFT image"
              objectFit="cover"
            />
          </div>
        </div>

        <div
          className={Style.NFTDetailsImg_box_description}
          onClick={openDescription}
        >
          <p>Description</p>
          {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {description && (
          <div className={Style.NFTDetailsImg_box_description_box}>
            <p>{nft.description}</p>
          </div>
        )}

        <div className={Style.NFTDetailsImg_box_details} onClick={openDetails}>
          <p>Details</p>
          {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {details && (
          <div className={Style.NFTDetailsImg_box_details_box}>
            <small>2000 x 2000 px.IMAGE(685KB)</small>
            <p>
              <small>Contract Address</small>
              <br />
              {nft.seller}
            </p>
            <p>
              <small>Token ID</small> &nbsp; &nbsp; {nft.tokenId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetailsImg;
