import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// INTERNAL IMPORT
import Style from "../../styles/collection.module.css";
import images from "../../img";
import {
  Banner,
  CollectionProfile,
  NFTCardTwo,
} from "../../collectionPage/collectionIndex";
import { Slider, Brand } from "../../components/componentsindex";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const Collection = () => {
  const [collectionData, setCollectionData] = useState(null); // State for collection data
  const [collectionName, setCollectionName] = useState(null); // State for collection data
  const [NFTData, setNFTData] = useState([]); // State for NFTs in the collection
  const [nfts, setNfts] = useState([]); // State for general NFTs
  const [nftsCopy, setNftsCopy] = useState([]); // State for copied NFTs
  const router = useRouter();
  const { id } = router.query; // Extract collection ID from URL
  const { currentAccount, fetchNFTs } = useContext(NFTMarketplaceContext);

  // Utility function to fetch data
  const fetchData = async (url, method = "GET", data = null) => {
    try {
      const options = { method, url };
      if (data) options.data = data;
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  };

  // Fetch collection data
  useEffect(() => {
    const loadCollectionData = async () => {
      // if (!id) return;

      try {
        const data = await fetchData(`http://localhost:5000/api/collection/${id}`);
        setCollectionData(data.collection);
        setCollectionName(data.collection);
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    };

    loadCollectionData();
  }, [id]);
  
  console.log(collectionName?.name, "collectionName");
  // Fetch NFTs in the collection
  useEffect(() => {
    const loadCollectionNFTs = async () => {
      if (!collectionName?.name) return;

      try {
        const data = await fetchData(
          `http://localhost:5000/api/nfts/collection-wise-nft`,
          "POST",
          { category: collectionName?.name }
        );
        setNFTData(data.matchingNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    loadCollectionNFTs();
  }, [collectionData]);

  console.log(NFTData, "NFTData");
  
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

  return (
    <div className={Style.collection}>
      <Banner bannerImage={collectionData?.banner || images.creatorbackground1} />
      {collectionData && <CollectionProfile collection={collectionData} />}
      <NFTCardTwo NFTData={NFTData.length > 0 ? NFTData : nfts} />
      <Brand />
    </div>
  );
};

export default Collection;
