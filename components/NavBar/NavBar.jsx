import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import { DiJqueryLogo } from "react-icons/di";
import { MdNotifications } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { CgMenuRight } from "react-icons/cg";
import { useRouter } from "next/router";
import axios from "axios";

// INTERNAL IMPORT
import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar } from "./index";
import { Button, Error } from "../componentsindex";
import images from "../../img";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const navbarRef = useRef(null); // Create a ref for the navbar

  const router = useRouter();
  const { currentAccount, connectWallet, openError } = useContext(
    NFTMarketplaceContext
  );

  // Fetch the user's profile data and set profile image when currentAccount changes
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${currentAccount}`
        );
        setProfileImage(response.data.user?.profileImage || images.founder1); // Set fetched image or fallback
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (currentAccount) fetchProfileData();
  }, [currentAccount]);

  const handleClickOutside = (event) => {
    // Check if the click is outside the navbar and its menus
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setDiscover(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
      setOpenSideMenu(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the navbar
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={Style.navbar} ref={navbarRef}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <DiJqueryLogo onClick={() => router.push("/")} />
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            <p
              onClick={() => {
                setDiscover(!discover);
                setHelp(false);
                setNotification(false);
                setProfile(false);
              }}
            >
              Discover
            </p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_help}>
            <p
              onClick={() => {
                setHelp(!help);
                setDiscover(false);
                setNotification(false);
                setProfile(false);
              }}
            >
              Help Center
            </p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_notify}>
            <MdNotifications
              className={Style.notify}
              onClick={() => {
                setNotification(!notification);
                setDiscover(false);
                setHelp(false);
                setProfile(false);
              }}
            />
            {notification && <Notification />}
          </div>

          <div className={Style.navbar_container_right_button}>
            {currentAccount === "" ? (
              <Button btnName="Connect" handleClick={() => connectWallet()} />
            ) : (
              <Button
                btnName="Create"
                handleClick={() => router.push("/uploadNFT")}
              />
            )}
          </div>

          <div className={Style.navbar_container_right_profile_box}>
            <div className={Style.navbar_container_right_profile}>
              <Image
                src={profileImage || images.founder1} // Replace with a valid fallback path
                alt="Profile"
                width={40}
                height={40}
                onClick={() => setProfile(!profile)}
                className={Style.navbar_container_right_profile}
              />

              {profile && <Profile currentAccount={currentAccount} />}
            </div>
          </div>

          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight
              className={Style.menuIcon}
              onClick={() => setOpenSideMenu(!openSideMenu)}
            />
          </div>
        </div>
      </div>

      {openSideMenu && (
        <div className={Style.sideBar}>
          <SideBar
            setOpenSideMenu={setOpenSideMenu}
            currentAccount={currentAccount}
            connectWallet={connectWallet}
          />
        </div>
      )}

      {openError && <Error />}
    </div>
  );
};

export default NavBar;
