import React, { useState, useEffect, useContext } from "react";

// INTERNAL IMPORT
import Style from "../styles/index.module.css";
import {
  HeroSection,
  Service,
  BigNFTSilder,
  Subscribe,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  AudioLive,
  FollowerTab,
  Slider,
  Brand,
  Video,
  Loader,
} from "../components/componentsindex";
import { getTopCreators } from "../TopCreators/TopCreators";

// IMPORTING CONTRACT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import FollowerTabCard from "../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import Authors from "./authors";

const Home = () => {
  const { checkIfWalletConnected, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs().then((items) => {
        setNfts(items?.reverse() || []); // Ensure items is an array
        setNftsCopy(items || []);
      });
    }
  }, [currentAccount]);

  // CREATOR LIST
  const creators = getTopCreators(nfts || []); // Ensure creators is always an array

  console.log(nfts);
  
  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      {/* <BigNFTSilder /> */}

     
      <Authors slices={4} showBrand={false} className="author-spacing"/> 
      <div><div className={Style.followerTab_member}>
        
      </div><div className={Style.followerTab_member_box }>
          {/* <a href="authors">Show me more</a> */}
        </div></div>
        
      <div className={Style.followerTab_member}>
        <div className={Style.followerTab_member_box }>
          <a href="authors">Show me more</a>
        </div>
      </div>
  
      <Collection  slices={3}/>
      <div className={Style.followerTab_member}>
        <div className={Style.followerTab_member_box }>
          <a href="collectionsPage">Show me more</a>
        </div>
      </div>

      <div className={Style.centeredContainer}>
        <Title heading="Featured NFTs" />
      </div>

      {nfts.length === 0 ? <Loader /> : <NFTCard isslice={2}  NFTData={nfts} />}
      
      <div className={Style.followerTab_member}>
        <div className={Style.followerTab_member_box}>
          <a href="searchPage">Show me more</a>
        </div>
      </div>

      <Brand />
    </div>
  );
};

export default Home;
