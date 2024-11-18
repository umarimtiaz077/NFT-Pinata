import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { MdVerified } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import Style from "./FollowerTabCard.module.css";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const FollowerTabCardTwo = ({
  i,
  el,
  initialFollowing = [],
  onFollowStatusChange,
  relationType,
}) => {
  const { followUser, unfollowUser, userId } = useContext(NFTMarketplaceContext);
  const router = useRouter();

  // States
  const [following, setFollowing] = useState(false);

  // Derived Values
  const isOwnProfile = el?.seller && userId && el.seller === userId;
  const background = el?.background || el?.profileImage || "/default-background.jpg";
  const profileImage = el?.profileImage || el?.background || "/default-profile.jpg";

  // Initialize `following` state
  useEffect(() => {
    setFollowing(
      Array.isArray(initialFollowing) && initialFollowing.includes(el?.seller)
    );
  }, [initialFollowing, el?.seller]);

  // Follow/Unfollow Handler
  const toggleFollow = async (e) => {
    e.stopPropagation(); // Prevents triggering the card click event
    try {
      let response;
      if (following) {
        response = await unfollowUser(el.seller);
        if (response?.success) {
          setFollowing(false);
          onFollowStatusChange?.("Unfollowed");
        }
      } else {
        response = await followUser(el.seller);
        if (response?.success) {
          setFollowing(true);
          onFollowStatusChange?.("Followed");
        }
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  // Navigate to user detail page
  const redirectToDetailPage = () => {
    router.push({
      pathname: "/detailUser",
      query: { seller: el?.seller },
    });
  };

  return (
    <div className={Style.FollowerTabCard} onClick={redirectToDetailPage}>
      <div className={Style.FollowerTabCard_rank}>
        <p>
          #{i + 1} <span>🥇</span>
        </p>
      </div>

      <div className={Style.FollowerTabCard_box}>
        {/* Background Image */}
        <div className={Style.FollowerTabCard_box_img}>
          <Image
            className={Style.FollowerTabCard_box_img_img}
            src={background}
            alt="profile background"
            width={500}
            height={300}
            objectFit="cover"
          />
        </div>

        {/* Profile Image */}
        <div className={Style.FollowerTabCard_box_profile}>
          <Image
            className={Style.FollowerTabCard_box_profile_img}
            alt="profile picture"
            width={50}
            height={50}
            src={profileImage}
          />
        </div>

        {/* Info Section */}
        <div className={Style.FollowerTabCard_box_info}>
          <div className={Style.FollowerTabCard_box_info_name}>
            <h4>
              {el?.username || "Unnamed User"}
              {/* <span>
                <MdVerified />
              </span> */}
            </h4>
            
          </div>

          {/* Follow/Unfollow Button */}
          <div className={Style.FollowerTabCard_box_info_following}>
            <a
              onClick={(e) => toggleFollow(e)}
              style={{
                pointerEvents: isOwnProfile ? "none" : "auto",
                opacity: isOwnProfile ? 0.5 : 1,
              }}
            >
              {isOwnProfile ? "You" : following ? "Unfollow" : "Follow"}
              {/* <span>
                <TiTick />
              </span> */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerTabCardTwo;
