import React, { useEffect, useState, useContext } from "react";

// INTERNAL IMPORT
import Style from "../styles/searchPage.module.css";
import { Slider, Brand, Loader } from "../components/componentsindex";
import { SearchBar } from "../SearchPage/searchBarIndex";
import { Filter } from "../components/componentsindex";

import { NFTCardTwo, Banner } from "../collectionPage/collectionIndex";
import images from "../img";

// SMART CONTRACT IMPORT
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const searchPage = () => {
  const { fetchNFTs, setError, currentAccount } = useContext(
    NFTMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      if (currentAccount) {
        fetchNFTs().then((items) => {
          setNfts(items?.reverse());
          setNftsCopy(items);
        });
      }
    } catch (error) {
      setError("Please reload the browser", error);
    }
  }, [currentAccount]);

  const onHandleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setNfts(nftsCopy);
    } else {
      const filteredNFTs = nftsCopy.filter((nft) =>
        nft.name.toLowerCase().includes(query.toLowerCase())
      );
      setNfts(filteredNFTs);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    setNfts(nftsCopy);
  };

  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
        searchQuery={searchQuery}
      />
      {/* <Filter /> */}
      {nfts?.length === 0 ? <Loader /> : <NFTCardTwo NFTData={nfts} />}
      <Brand />
    </div>
  );
};

export default searchPage;
