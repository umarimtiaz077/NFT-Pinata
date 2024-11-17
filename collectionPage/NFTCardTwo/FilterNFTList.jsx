import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdVerified, MdTimer } from "react-icons/md";
import Link from "next/link";

// INTERNAL IMPORT
import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../components/componentsindex";

const FilterNFTCardTwo = ({ NFTData, sortOrder  }) => {
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);
  const [sortedData, setSortedData] = useState([]);

  const likeNFT = () => {
    if (!like) {
      setLike(true);
      setLikeInc(likeInc + 1);
    } else {
      setLike(false);
      setLikeInc(likeInc - 1);
    }
  };

  useEffect(() => {
    if (NFTData) {
      const sorted = [...NFTData].sort((a, b) => {
        if (sortOrder === "asc") {
          return parseFloat(a.price) - parseFloat(b.price);
        } else if (sortOrder === "desc") {
          return parseFloat(b.price) - parseFloat(a.price);
        }
        return 0;
      });
      setSortedData(sorted);
    }
  }, [NFTData, sortOrder]);

  return (
    <div className={Style.NFTCardTwo}>
      {sortedData?.map((el, i) => (
        <Link href={{ pathname: "/NFT-details", query: el }} key={i}>
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
              <small>{4 + i}</small>
            </div>

            <div className={Style.NFTCardTwo_box_price}>
              <div className={Style.NFTCardTwo_box_price_box}>
                <small>Current Bid</small>
                <p>{el.price || `${i + 4} ETH`}</p>
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

export default FilterNFTCardTwo;
