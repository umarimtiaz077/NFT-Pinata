import React, { useState } from "react";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../components/componentsindex";

const LikeNFTCardTwo = ({ NFTData, wallet_address }) => {
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);
console.log('ssssssssssssssssssssssssssssssss');

  const likeNFT = () => {
    if (!like) {
      setLike(true);
      setLikeInc(23);
    } else {
      setLike(false);
      setLikeInc(23 + 1);
    }
  };

  return (
    <div className={Style.NFTCardTwo}>
      
      {NFTData?.map((el, i) => {
        // Check if the seller is the same as wallet_address, if not, skip this NFT
        if (el.seller.toLowerCase() !== wallet_address.toLowerCase()) {
          return <>{el.seller} == {wallet_address} </>; // Skip rendering this NFT
        }

        return (
          <Link href={{ pathname: "/NFT-details", query: el }} key={i + 1}>
            <div className={Style.NFTCardTwo_box}>
              <div className={Style.NFTCardTwo_box_like}>
                <div className={Style.NFTCardTwo_box_like_box}>
                  <div className={Style.NFTCardTwo_box_like_box_box}>
                    <BsImage className={Style.NFTCardTwo_box_like_box_box_icon} />
                    <p onClick={() => likeNFT()}>
                      {like ? <AiOutlineHeart /> : <AiFillHeart />}
                      <span>{likeInc + 1}</span>
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

export default LikeNFTCardTwo;
