import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";
import Style from "./FollowerTabCard.module.css";

const FollowerTabCard = ({ i, el, initialFollowing = [], onFollowStatusChange, relationType }) => {
  const { followUser, unfollowUser, userId, getFollowersAndFollowing } = useContext(NFTMarketplaceContext);
  const router = useRouter();

  // States
  const [following, setFollowing] = useState(false);

  // Derived Values
  const isOwnProfile = el.seller === userId;
  const background = el.background || el.profileImage || "/default-background.jpg";
  const profileImage = el.profileImage || el.background || "/default-profile.jpg";

  // Initialize `following` state
  useEffect(() => {
    setFollowing(Array.isArray(initialFollowing) && initialFollowing.includes(el.seller));
  }, [initialFollowing, el.seller]);

  // Follow/Unfollow Handler
  const toggleFollow = async (e) => {
    e.stopPropagation(); // Prevents triggering the card click event

    try {
      let response;
      if (following) {
        // If currently following, unfollow the user
        response = await unfollowUser(el.seller);
        if (response?.success) {
          // Update local state for "unfollowed"
          setFollowing(false);
          // Propagate the change to parent component
          onFollowStatusChange?.("Unfollowed", el.seller);
        }
      } else {
        // If not following, follow the user
        response = await followUser(el.seller);
        if (response?.success) {
          // Update local state for "followed"
          setFollowing(true);
          // Propagate the change to parent component
          onFollowStatusChange?.("Followed", el.seller);
        }
      }

      // Update followers/following list in the context to reflect the changes
      await getFollowersAndFollowing(userId); // Ensure context is updated
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  // Navigate to user detail page
  const redirectToDetailPage = () => {
    router.push({
      pathname: "/detailUser",
      query: { seller: el.seller },
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
            <h4>{el.user || "Unnamed User"}</h4>
            {/* <p>{el.total || 0} ETH</p> */}
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
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerTabCard;
