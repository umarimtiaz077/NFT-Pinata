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
  const { fetchMyNFTsOrListedNFTs, currentAccount, followUser, unfollowUser, wallet_address } =
    useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [followerProfiles, setFollowerProfiles] = useState([]);
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("Listed NFTs");

  
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${profileData._id}/followers`
        );
        const Followers = response.data.map((followers) => ({
          ...followers,
          seller: followers._id,
          user: followers.username || "Unnamed User",
        }));
        setFollowerProfiles(Followers);
        // setFollowingProfiles([]); // Clear other list when switching tabs
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
        // setFollowerProfiles([]);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };
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
    fetchFollowers();
    fetchFollowing();
    console.log(profileData, "this is profile data");
    console.log(followerProfiles, "this is follower profiles");
    console.log(followingProfiles, "this is following profiles");
    
  }, [currentAccount]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Followers") fetchFollowers();
    else if (tab === "Following") fetchFollowing();
    // console.log(profileData, "this is profile data");
    console.log(followerProfiles, "this is follower profiles");
    // console.log(followingProfiles, "this is following profiles");

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

      {["Listed NFTs", "Own NFT"].includes(activeTab) && (
        <AuthorNFTCardBox
          collectiables={activeTab === "Listed NFTs"}
          created={activeTab === "Own NFT"}
          like={false}
          follower={false}
          following={false}
          nfts={nfts}
          myNFTS={myNFTs}
        />
      )}


      
      {activeTab === "Liked" && (
        <LikeNFTCard wallet_address={wallet_address} NFTData={nfts} />
      )}

      <Title
        heading="Popular Creators"
        paragraph="Click on music icon and enjoy NFT music or audio"
      />

      <div className={Style.author_box}>
        {/* {(activeTab === "Followers"
          ? followingProfiles
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
        ))} */}
      {activeTab === "Followers" && followerProfiles.map((profile, i) => (
            <FollowerTabCard
              key={profile._id || i}
              i={i}
              el={profile}
              // relationType={activeTab === "Followers" ? "follower" : "following"}
              onFollowStatusChange={handleTabClick} 
            />
          
      ))}
      {activeTab === "Following" && followingProfiles.map((profile, i) => (
            <FollowerTabCard
              key={profile._id || i}
              i={i}
              el={profile}
              // relationType={activeTab === "Followers" ? "follower" : "following"}
              onFollowStatusChange={handleTabClick} 
            />
          
      ))}
      </div>

      <Brand />
    </div>
  );
};

export default Author;