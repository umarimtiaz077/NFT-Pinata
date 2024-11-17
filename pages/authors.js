import React, { useState, useEffect, useContext } from "react";
import Style from "../styles/author.module.css";
import { Title, Brand } from "../components/componentsindex";
import FollowerTabCard from "../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Authors = () => {
  const { fetchAllProfiles, isFollowingUser, userId } = useContext(NFTMarketplaceContext);
  const [profiles, setProfiles] = useState([]);
  const [followingStatuses, setFollowingStatuses] = useState({});

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await fetchAllProfiles();
      setProfiles(data);
      
      const statuses = await Promise.all(
        data.map(async (profile) => ({
          id: profile.seller,
          following: await isFollowingUser(profile.seller),
        }))
      );
    
      const mappedStatuses = Object.fromEntries(statuses.map((s) => [s.id, s.following]));
      setFollowingStatuses(mappedStatuses);
    };
    
    fetchProfiles();
  }, [fetchAllProfiles, userId]);  

  return (
    <div className={Style.author}>
      <Title heading="Popular Creators" />
      <div className={Style.author_box}>
        {profiles.map((profile, i) => (
          <FollowerTabCard
            key={i}
            i={i}
            el={profile}
            // relationType={"following"}
            initialFollowing={followingStatuses[profile.seller]} 
          />
        ))}
      </div>
      <Brand />
    </div>
  );
};

export default Authors;
