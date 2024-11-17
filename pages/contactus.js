import React, { useState } from "react";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { HiOutlineMail } from "react-icons/hi";

// INTERNAL IMPORT
import Style from "../styles/contactus.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    subject: "",
    userEmail: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/email/submit-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setResponseMessage("Message sent successfully!");
      } else {
        setResponseMessage("Failed to send the message. Please try again.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.contactus}>
      <div className={Style.contactus_box}>
        <h1>Contact</h1>
        <div className={Style.contactus_box_box}>
          <div className={Style.contactus_box_box_left}>
            {/* Left Section */}
            <div className={Style.contactus_box_box_left_item}>
              <h3>🗺 ADDRESS</h3>
              <p>
                Photo booth tattooed prism, portland taiyaki hoodie neutra
                typewriter
              </p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>💌 EMAIL</h3>
              <p>nc.example@example.com</p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>☎ PHONE</h3>
              <p>000-123-456-7890</p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>🌏 SOCIALS</h3>
              <a href="#">
                <TiSocialFacebook />
              </a>
              <a href="#">
                <TiSocialLinkedin />
              </a>
              <a href="#">
                <TiSocialInstagram />
              </a>
              <a href="#">
                <TiSocialYoutube />
              </a>
              <a href="#">
                <TiSocialTwitter />
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className={Style.contactus_box_box_right}>
            <form onSubmit={handleSubmit}>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="subject">Full Name</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Your Full Name"
                  className={formStyle.Form_box_input_userName}
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="userEmail">Email</label>
                <div className={formStyle.Form_box_input_box}>
                  <div className={formStyle.Form_box_input_box_icon}>
                    <HiOutlineMail />
                  </div>
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="Your Email"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  cols="30"
                  rows="6"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`${Style.button} ${loading ? Style.disabled : ""}`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {responseMessage && <p>{responseMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
