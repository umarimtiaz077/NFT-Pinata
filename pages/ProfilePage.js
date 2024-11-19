import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/profilePage.module.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(null);

  const router = useRouter();

  const accessToken =
    "IGQWRPazR4clBKQzNqQ3lfUnI5ZAk9NU252czE3UHpMWkxnelAzTFBSNGZAucHdpT1hWdUdOeDItTk9TXzRzYmFERXdzeE9IYmJxUUM0VnhkamkyU3VtRU5wV2g1MzNfa3dlSEJ3MzFQZAFZAXX3I2a0tNVVZAhMU1kZAlUZD";

  const fetchUserProfile = async () => {
    const url = `https://graph.instagram.com/me?fields=id,username,media_count&access_token=${accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.username) {
        setProfile(data);
      } else {
        console.error("Error fetching profile data", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchInstagramData = async () => {
    const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp&access_token=${accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.data) {
        setPosts(data.data);
      } else {
        console.error("Error fetching Instagram data", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const selectPost = (index) => {
    setCurrentPostIndex(index);
  };

  const navigateToUploadNFT = () => {
    if (currentPostIndex !== null) {
      const selectedPost = posts[currentPostIndex];
      router.push({
        pathname: "/uploadNFT",
        query: {
          mediaUrl: selectedPost.media_url, // Pass the media URL
        },
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchInstagramData();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>
            <i className={`fab fa-instagram ${styles.headerIcon}`}></i> Instagram
          </h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              <div className={styles.profileInfo}>
                <img
                  alt="Profile picture"
                  className={styles.profileImage}
                  src={
                    profile
                      ? "https://images.vexels.com/content/147101/preview/instagram-profile-button-68a534.png"
                      : ""
                  }
                />
                <div>
                  <h2 className={styles.profileName}>
                    {profile ? profile.username : "Username"}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.postSection}>
            <div className={styles.postCard}>
              <div className={styles.postHeader}>
                <button className={styles.postButton}>Posts</button>
              </div>
              <div className={styles.postGrid}>
                {posts.map((post, index) => {
                  const imageUrl =
                    post.media_type === "VIDEO"
                      ? post.thumbnail_url
                      : post.media_url;
                  return (
                    <div
                      key={post.id}
                      className={`${styles.post} ${
                        index === currentPostIndex ? styles.selected : ""
                      }`}
                      onClick={() => selectPost(index)}
                    >
                      {post.media_type === "VIDEO" ? (
                        <video className={styles.postVideo} controls>
                          <source src={post.media_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          className={styles.postImage}
                          src={imageUrl}
                          alt={post.caption}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.nextButtonContainer}>
          <button
            className={`${styles.nextButton} ${
              currentPostIndex === null ? styles.disabled : ""
            }`}
            disabled={currentPostIndex === null}
            onClick={navigateToUploadNFT}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
