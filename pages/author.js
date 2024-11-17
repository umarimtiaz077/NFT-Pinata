import React, { useState, useEffect, useContext } from "react";
import Style from "../styles/author.module.css";
import { Banner } from "../collectionPage/collectionIndex";
import { Brand, Title } from "../components/componentsindex";
import FollowerTabCard from "../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox,
} from "../authorPage/componentIndex";
import axios from "axios";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Author = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount, followUser, unfollowUser } =
    useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [followerProfiles, setFollowerProfiles] = useState([]);
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("Listed NFTs");

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then(setNfts);
    fetchMyNFTsOrListedNFTs("fetchMyNFTs").then(setMyNFTs);
  }, [fetchMyNFTsOrListedNFTs]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${currentAccount}`
        );
        setProfileData(response.data.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    if (currentAccount) fetchProfileData();
  }, [currentAccount]);

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${profileData._id}/followers`
      );
      const standardizedFollowers = response.data.map((follower) => ({
        ...follower,
        seller: follower._id,
        user: follower.username || "Unnamed User",
      }));
      setFollowerProfiles(standardizedFollowers);
      setFollowingProfiles([]); // Clear other list when switching tabs
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${profileData._id}/following`
      );
      const standardizedFollowing = response.data.map((following) => ({
        ...following,
        seller: following._id,
        user: following.username || "Unnamed User",
      }));
      setFollowingProfiles(standardizedFollowing);
      setFollowerProfiles([]);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Followers") fetchFollowers();
    else if (tab === "Following") fetchFollowing();
  };

  return (
    <div className={Style.author}>
      <Banner
        bannerImage={profileData?.background || "/default-background.jpg"}
      />

      {profileData && (
        <AuthorProfileCard
          currentAccount={currentAccount}
          profileImage={profileData.profileImage}
          username={profileData.username}
          description={profileData.description}
          socialLinks={profileData.socialLinks}
        />
      )}

      <AuthorTaps activeTab={activeTab} onTabClick={handleTabClick} />

      {["Listed NFTs", "Own NFT", "Liked"].includes(activeTab) && (
        <AuthorNFTCardBox
          collectiables={activeTab === "Listed NFTs"}
          created={activeTab === "Own NFT"}
          like={activeTab === "Liked"}
          follower={false}
          following={false}
          nfts={nfts}
          myNFTS={myNFTs}
        />
      )}

      <Title
        heading="Popular Creators"
        paragraph="Click on music icon and enjoy NFT music or audio"
      />

      <div className={Style.author_box}>
        {(activeTab === "Followers"
          ? followerProfiles
          : activeTab === "Following"
          ? followingProfiles
          : []
        ).map((profile, i) => (
          <FollowerTabCard
            key={profile._id || i}
            i={i}
            el={profile}
            relationType={activeTab === "Followers" ? "follower" : "following"}
            onFollowStatusChange={handleTabClick} 
          />
        ))}
      </div>

      <Brand />
    </div>
  );
};

export default Author;
