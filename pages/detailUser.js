import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// INTERNAL IMPORTS
import Style from "../styles/author.module.css";
import { Banner } from "../collectionPage/collectionIndex";
import { Brand, Title } from "../components/componentsindex";
import {
  AuthorProfileCard,
  AuthorNFTCardBox,
} from "../authorPage/componentIndex";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import LikeNFTCardTwo from "../collectionPage/NFTCardTwo/LikeNFTCard";
import UserTaps from "../authorPage/AuthorTaps/UserTaps";
import LikeNFTCard from "../collectionPage/NFTCardTwo/MyLikeNFT";

const DetailUser = () => {
  const router = useRouter();
  const { seller } = router.query;

  const { fetchMyNFTsOrListedNFTs, setNftsCopy, currentAccount, fetchNFTs } =
    useContext(NFTMarketplaceContext);

  const [userData, setUserData] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState("Listed NFTs");

  // Reusable data fetching function
  const fetchData = async (url, setter) => {
    try {
      const { data } = await axios.get(url);
      setter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  // Fetch NFT data by type (Listed, Created, Liked)
  const fetchNFTData = async (type, setter) => {
    try {
      const data = await fetchMyNFTsOrListedNFTs(type);
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  // Handle tab change and fetch followers/following data
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (["Followers", "Following"].includes(tab)) {
      const endpoint = tab === "Followers" ? "followers" : "following";
      fetchData(
        `http://localhost:5000/api/users/${seller}/${endpoint}`,
        setFollowers
      );
    }
  };

  // Fetch user NFTs
  useEffect(() => {
    const loadUserNFTs = async () => {
      if (!currentAccount) return;

      try {
        const items = await fetchNFTs();
        setNfts(items?.reverse());
        setNftsCopy(items);
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
      }
    };

    loadUserNFTs();
  }, [currentAccount]);

  // Fetch data on component mount and when seller changes
  useEffect(() => {
    if (seller) {
      fetchData(
        `http://localhost:5000/api/users/profile/${seller}`,
        setUserData
      );
      // fetchNFTData("fetchItemsListed", setNfts);
      // fetchNFTData("fetchMyNFTs", setMyNFTs);
    }
  }, [seller]);

  // Ensure followers is an array before mapping over it
  const followersList = Array.isArray(followers) ? followers : [];

  // Render the NFT cards box based on the active tab
  const renderAuthorNFTCardBox = () => {
    const nftConditions = {
      listed: activeTab === "Listed NFTs",
      created: activeTab === "Created NFT",
      // liked: activeTab === "Liked",
    };

    return Object.values(nftConditions).some(Boolean) ? (
      <AuthorNFTCardBox
        listed={nftConditions.listed}
        created={false}
        liked={false}
        follower={false}
        following={false}
        nfts={nfts}
        myNFTs={myNFTs}
      />
    ) : null;
  };

  return (
    <div className={Style.author}>
      <Banner bannerImage={userData?.background || "/default-background.jpg"} />

      {userData && (
        <AuthorProfileCard
          currentAccount={userData.walletAddress}
          profileImage={userData.profileImage}
          username={userData.username}
          description={userData.description}
          socialLinks={userData.socialLinks}
        />
      )}

      <UserTaps activeTab={activeTab} onTabClick={handleTabClick} />

      {/* Render NFTs based on the active tab */}
      {activeTab === "Created NFT" && (
        <LikeNFTCardTwo
          wallet_address={userData?.walletAddress}
          NFTData={nfts}
        />
      )}
      {activeTab === "Liked" && (
        <LikeNFTCard wallet_address={userData?.walletAddress} NFTData={nfts} />
      )}

      <Title
        heading="Popular Creators"
        paragraph="Click on music icon and enjoy NFT music or audio"
      />

      {/* Followers/Following */}
      <div className={Style.author_box}>
        {followersList.map((follower, i) => (
          <FollowerTabCard key={follower._id || i} i={i} el={follower} />
        ))}
      </div>

      <Brand />
    </div>
  );
};

export default DetailUser;
