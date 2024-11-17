import React, { useEffect, useState } from "react";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Link from "next/link";

// INTERNAL IMPORT
import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../components/componentsindex";

// Helper function to fetch data
const fetchData = async (url, method) => {
  const response = await fetch(url, { method });
  const data = await response.json();
  return data;
};

const LikeNFTCard = ({ NFTData, wallet_address }) => {
  const [myNFTs, setMyNFTs] = useState([]);

  // Fetch NFTs liked by the user (only once on mount)
  useEffect(() => {
    const findLikedNftImageUrl = async () => {
      try {
        const data = await fetchData(
          `http://localhost:5000/api/nfts/user-liked?userAddress=${wallet_address}`,
          "GET"
        );
        console.log("Fetched liked NFTs:", data);
        setMyNFTs(data); // Update myNFTs with the fetched data
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    findLikedNftImageUrl();
  }, []); // Empty dependency array to run once when the component mounts

  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);

  // Handle like/unlike functionality
  const likeNFT = () => {
    setLike((prevLike) => {
      const newLike = !prevLike;
      setLikeInc((prevInc) => (newLike ? prevInc + 1 : prevInc - 1));
      return newLike;
    });
  };

  // Ensure myNFTs is an array before calling .some()
  const isLiked = (image) => {
    return Array.isArray(myNFTs) && myNFTs.some((likedNFT) => likedNFT.image === image);
  };

  return (
    <div className={Style.NFTCardTwo}>
      {NFTData?.map((el, i) => {
        // Check if the seller is the same as wallet_address (case-insensitive)
        if (el.seller.toLowerCase() !== wallet_address.toLowerCase()) {
          return <></>; // Skip rendering this NFT if seller doesn't match wallet_address
        }

        // Check if the current NFT image is liked by the user by matching the imageUrl
        if (!isLiked(el.image)) {
          return <></>; // Skip if the image is not found in myNFTs
        }

        return (
          <Link href={{ pathname: "/NFT-details", query: el }} key={i + 1}>
            <div className={Style.NFTCardTwo_box}>
              <div className={Style.NFTCardTwo_box_like}>
                <div className={Style.NFTCardTwo_box_like_box}>
                  <div className={Style.NFTCardTwo_box_like_box_box}>
                    <BsImage className={Style.NFTCardTwo_box_like_box_box_icon} />
                    <p onClick={likeNFT}>
                      {like ? <AiOutlineHeart /> : <AiFillHeart />}
                      <span>{likeInc}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={Style.NFTCardTwo_box_img}>
                <img
                  src={el.image}
                  alt="NFT"
                  className={Style.NFTCardTwo_box_img_img}
                  objectFit="cover"
                />
              </div>

              <div className={Style.NFTCardTwo_box_info}>
                <div className={Style.NFTCardTwo_box_info_left}>
                  <LikeProfile />
                  <p>{el.name}</p>
                </div>
                <small>{i + 2}</small>
              </div>

              <div className={Style.NFTCardTwo_box_price}>
                <div className={Style.NFTCardTwo_box_price_box}>
                  <small>Current Bid</small>
                  <p>{el.price || i + 4} ETH</p>
                </div>
                <p className={Style.NFTCardTwo_box_price_stock}>
                  <MdTimer /> <span>{i + 1} hours left</span>
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LikeNFTCard;
