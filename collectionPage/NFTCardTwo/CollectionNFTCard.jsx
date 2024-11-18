import React, {useEffect, useState } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdVerified, MdTimer } from "react-icons/md";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../components/componentsindex";

const CollectionNFTCard = ({ NFTData }) => {
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);
  const [imageData, setImageData] = useState(null);
  const likeNFT = () => {
    if (!like) {
      setLike(true);
      setLikeInc(23);
    } else {
      setLike(false);
      setLikeInc(23 + 1);
    }
  };

  // console.log(NFTData);
  useEffect(() => {
    // Function to fetch the data from the imageUrl
    const fetchImageData = async () => {
      if (NFTData && NFTData[0]?.imageUrl) {
        try {
          const response = await fetch(NFTData[0].imageUrl); // Make GET request
          if (!response.ok) {
            throw new Error("Failed to fetch image data");
          }
          const data = await response.text(); // Assuming the response is text (can be JSON or other format)
          setImageData(data); // Save the response data to state
          console.log(data,"kkmj");
        } catch (error) {
          console.error("Error fetching image data:", error);
        }
      }
    };

    fetchImageData();
  }, [NFTData]);

  return (
    <div className={Style.NFTCardTwo}>
      {NFTData?.map((el, i) => (
        <Link href={{ pathname: "/collectionUserDetail", query: el }} key={i + 1}>
          <div className={Style.NFTCardTwo_box} key={i + 1}>
            <div className={Style.NFTCardTwo_box_like}>
              <div className={Style.NFTCardTwo_box_like_box}>
                <div className={Style.NFTCardTwo_box_like_box_box}>
                  <BsImage className={Style.NFTCardTwo_box_like_box_box_icon} />
                  <p onClick={() => likeNFT()}>
                    {like ? <AiOutlineHeart /> : <AiFillHeart />}
                    {""}
                    <span>{likeInc + 1}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={Style.NFTCardTwo_box_img}>
              {console.log(el.imageUrl.image)}
              <img
                src={el.imageUrl}
                alt="NFT"
                className={Style.NFTCardTwo_box_img_img}
                objectFit="cover"
              />
            </div>

            <div className={Style.NFTCardTwo_box_info}>
              <div className={Style.NFTCardTwo_box_info_left}>
                {/* <LikeProfile /> */}
                <p>{el.itemName}</p>
              </div>
              {/* <small>4{i + 2}</small> */}
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
      ))}
    </div>
  );
};

export default CollectionNFTCard;
