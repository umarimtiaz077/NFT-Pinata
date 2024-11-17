import React, { useState, useEffect } from "react";
import {
  BsFillAlarmFill,
  BsFillCalendarDateFill,
  BsCalendar3,
} from "react-icons/bs";
import axios from "axios";

// INTERNAL IMPORT
import Style from "./Collection.module.css";
import DaysComponent from "./DaysComponents/DaysComponents";

const Collection = ({ slices }) => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [popular, setPopular] = useState(true);
  const [following, setFollowing] = useState(false);
  const [news, setNews] = useState(false);

  // Fetch all collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/collection"
        );
        setCollections(response.data.collections);
        setFilteredCollections(response.data.collections); // Populate filteredCollections initially
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  // Log collections to ensure correct data
  useEffect(() => {
    console.log("Fetched Collections from DB:", collections);
  }, [collections]);

  useEffect(() => {
    console.log("Filtered Collections:", filteredCollections);
  }, [filteredCollections]);

  // Handlers for toggling between filters
  const openPopular = () => {
    setPopular(true);
    setFollowing(false);
    setNews(false);
    setFilteredCollections(collections); // Modify this to apply specific filter logic if needed
  };

  const openFollower = () => {
    setPopular(false);
    setFollowing(true);
    setNews(false);
    setFilteredCollections(collections); // Modify this to apply specific filter logic if needed
  };

  const openNews = () => {
    setPopular(false);
    setFollowing(false);
    setNews(true);
    setFilteredCollections(collections); // Modify this to apply specific filter logic if needed
  };

  return (
    <div className={Style.collection}>
      <div className={Style.collection_title}>
        <h2>Discover Collections</h2>
        <div className={Style.collection_collections}>
          <div className={Style.collection_collections_btn}>
            <button onClick={openPopular}>
              <BsFillAlarmFill /> 24 hours
            </button>
            <button onClick={openFollower}>
              <BsCalendar3 /> 7 days
            </button>
            <button onClick={openNews}>
              <BsFillCalendarDateFill /> 30 days
            </button>
          </div>
        </div>
      </div>

      <div className={Style.collection_box}>
        {slices && (
          <>
            {filteredCollections.slice(0, 3).map((collection, index) => (
              <DaysComponent key={collection._id} el={collection} i={index} />
            ))}
          </>
        )}
        {!slices && (
          <>
            {filteredCollections.map((collection, index) => (
              <DaysComponent key={collection._id} el={collection} i={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
