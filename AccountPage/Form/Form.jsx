// Form.js (Child Component)
import React, { useState,useContext,useEffect } from "react";
import axios from "axios";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContentCopy } from "react-icons/md";
import { TiSocialFacebook, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext.js";
// INTERNAL IMPORT
import Style from "./Form.module.css";
import { Button } from "../../components/componentsindex.js";

const Form = ({ fileUrl }) => {
  const { currentAccount,userId } = useContext(NFTMarketplaceContext);

  // State for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [walletAddress, setWalletAddress] = useState(currentAccount || "");

  useEffect(() => {
    console.log("useeffect runs");
    console.log("userId is...",userId)
    if (userId) {
      // Fetch profile data on load if userId exists
      const fetchProfile = async () => {
        try {
          console.log("user id is ...",userId)
          const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
          const profileData = response.data;
          // Populate form fields with fetched data
          setUsername(profileData.username || "");
          setEmail(profileData.email || "");
          setDescription(profileData.description || "");
          setWebsite(profileData.website || "");
          setFacebook(profileData.socialLinks?.facebook || "");
          setTwitter(profileData.socialLinks?.twitter || "");
          setInstagram(profileData.socialLinks?.instagram || "");
          setWalletAddress(profileData.walletAddress || currentAccount || "");
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfile();
    }
  }, [userId, currentAccount]);

  useEffect(() => {
    if (currentAccount) {
      setWalletAddress(currentAccount);
    }
  }, [currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append profile data to FormData
      formData.append("username", username);
      formData.append("email", email);
      formData.append("description", description);
      formData.append("website", website);
      formData.append("socialLinks[facebook]", facebook);
      formData.append("socialLinks[twitter]", twitter);
      formData.append("socialLinks[instagram]", instagram);
      formData.append("walletAddress", walletAddress.toLowerCase());

      // Append fileUrl if available
      if (fileUrl) {
        formData.append("file", fileUrl); // Attach fileUrl (File object) to formData
      }

      // Send the request
      const response = await axios.put("http://localhost:5000/api/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        <form onSubmit={handleSubmit}>
          <div className={Style.Form_box_input}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="shoaib bhai"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={Style.Form_box_input_userName}
            />
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="email">Email</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <HiOutlineMail />
              </div>
              <input
                id="email"
                type="text"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              cols="30"
              rows="6"
              placeholder="something about yourself in a few words"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="website">Website</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                id="website"
                type="text"
                placeholder="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className={Style.Form_box_input_social}>
            <div className={Style.Form_box_input}>
              <label htmlFor="facebook">Facebook</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialFacebook />
                </div>
                <input
                  id="facebook"
                  type="text"
                  placeholder="http://shoaib"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="twitter">Twitter</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialTwitter />
                </div>
                <input
                  id="twitter"
                  type="text"
                  placeholder="http://shoaib"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="instagram">Instagram</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialInstagram />
                </div>
                <input
                  id="instagram"
                  type="text"
                  placeholder="http://shoaib"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className={Style.Form_box_input}>
            <label htmlFor="wallet">Wallet address</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                id="wallet"
                type="text"
                placeholder="0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineContentCopy />
              </div>
            </div>
          </div>

          <div className={Style.Form_box_btn}>
            <Button btnName="Upload profile" classStyle={Style.button} handleClick={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
