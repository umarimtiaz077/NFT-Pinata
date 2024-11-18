import React from "react";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./Discover.module.css";

const Discover = () => {
  //--------DISCOVER NAVIGATION MENU
  const discover = [
    {
      name: "Collection",
      link: "collectionsPage",
    },
    {
      name: "Marketplace",
      link: "searchPage",
    },
    {
      name: "Authors",
      link: "authors",
    },
    
    {
      name: "Create Collection",
      link: "createCollection",
    },
    {
      name: "Connect Instagram",
      link: "ProfilePage",
    },
  ];
  return (
    <div>
      {discover.map((el, i) => (
        <div key={i + 1} className={Style.discover}>
          <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Discover;
