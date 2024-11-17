import React, { useState, useEffect } from "react";
import {
  RiUserFollowFill,
  RiUserUnfollowFill,
  RiAwardLine,
} from "react-icons/ri";
import { useRouter } from "next/router"; // Import useRouter for navigation

// INTERNAL IMPORT
import Style from "./FollowerTab.module.css";
import FollowerTabCard from "./FollowerTabCard/FollowerTabCard";
import images from "../../img";

const FollowerTab = ({ isslice, TopCreator }) => {
  const router = useRouter();

  const [popular, setPopular] = useState(true);
  const [following, setFollowing] = useState(false);
  const [news, setNews] = useState(false);

  const openPopular = () => {
    if (!popular) {
      setPopular(true);
      setFollowing(false);
      setNews(false);
    }
  };
  const openFollower = () => {
    if (!following) {
      setPopular(false);
      setFollowing(true);
      setNews(false);
    }
  };
  const openNews = () => {
    if (!news) {
      setPopular(false);
      setFollowing(false);
      setNews(true);
    }
  };

  // Redirect to the detailed NFT page when clicking on a user
  const redirectToDetailPage = (seller) => {
    router.push(`/author?seller=${seller}`); // Navigate to author.js with seller ID in query
  };

  console.log(popular, following, news, TopCreator);
  

  return (
    <div className={Style.followerTab}>
      <div className={Style.followerTab_title}>
        <h2> Top Creators List..</h2>
        <div className={Style.followerTab_tabs}>
          <div className={Style.followerTab_tabs_btn}>
            <button onClick={() => openPopular()}>
              <RiUserFollowFill /> Popular
            </button>
            <button onClick={() => openFollower()}>
              <RiUserFollowFill /> Following
            </button>
            <button onClick={() => openNews()}>
              <RiAwardLine /> NoteWorthy
            </button>
          </div>
        </div>
      </div>

      {isslice ? (
        <>
          {popular && (
            <div className={Style.followerTab_box}>
              {TopCreator.slice(0, 3).map((el, i) => (
                <div
                  key={i + 1}
                  onClick={() => redirectToDetailPage(el.seller)}
                >
                  <FollowerTabCard i={i} el={el} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {popular && (
            <div className={Style.followerTab_box}>
              {TopCreator.map((el, i) => (
                <div
                  key={i + 1}
                  onClick={() => redirectToDetailPage(el.seller)}
                >
                  <FollowerTabCard i={i} el={el} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* {following && (
        <div className={Style.followerTab_box}>
          {FollowingArray.map((el, i) => (
            <div key={i + 1} onClick={() => redirectToDetailPage(el.seller)}>
              <FollowerTabCard i={i} el={el} />
            </div>
          ))}
        </div>
      )}

      {news && (
        <div className={Style.followerTab_box}>
          {NewsArray.map((el, i) => (
            <div key={i + 1} onClick={() => redirectToDetailPage(el.seller)}>
              <FollowerTabCard i={i} el={el} />
            </div>
          ))}
        </div>
      )} */}

      <div className={Style.followerTab_member}>
        <div className={Style.followerTab_member_box}>
          <a href="authors">Show me more</a>
        </div>
      </div>
    </div>
  );
};

export default FollowerTab;
