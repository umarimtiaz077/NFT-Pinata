import React, { useEffect, useState, useContext } from "react";

//INTRNAL IMPORT
import Style from "../styles/searchPage.module.css";
import { Slider, Brand, Loader } from "../components/componentsindex";
import { SearchBar } from "../SearchPage/searchBarIndex";
import { Filter } from "../components/componentsindex";

import { NFTCardTwo, Banner } from "../collectionPage/collectionIndex";
import images from "../img";

//SMART CONTRACT IMPORT
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import FilterNFTCardTwo from "../collectionPage/NFTCardTwo/FilterNFTList";

const searchPage = () => {
  const { fetchNFTs, setError, currentAccount } = useContext(
    NFTMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    try {
      if (currentAccount) {
        fetchNFTs().then((items) => {
          console.log("items are...", items);

          setNfts(items?.reverse());
          setNftsCopy(items);
          console.log(nfts);
        });
      }
    } catch (error) {
      setError("Please reload the browser", error);
    }
  }, [currentAccount]);

  const [sortOrder, setSortOrder] = useState("asc"); // Initial sort order

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      {/* <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      /> */}
      {/* <Filter /> */}
      <div
        className={Style.searchPage_box}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <button
          onClick={toggleSortOrder}
          style={{ marginBottom: "20px", padding: "10px", textAlign: "center" }}
        >
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
      </div>
      {/* NFT Display */}
      {nfts?.length === 0 ? (
        <Loader />
      ) : (
        <FilterNFTCardTwo sortOrder={sortOrder} NFTData={nfts} />
      )}
      <Brand />
    </div>
  );
};

export default searchPage;
