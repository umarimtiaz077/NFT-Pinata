import React from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import Link from "next/link";

// INTERNAL IMPORT
import Style from "./DaysComponents.module.css";

const DaysComponent = ({ el, i }) => {
  return (
    <Link href={`/collection/${el._id}`} passHref>
      <div className={Style.daysComponent}>
        <div className={Style.daysComponent_box}>
          <div className={Style.daysComponent_box_img}>
            <Image
              src={el.image || "/img/founder1.jpg"} // Absolute path for fallback
              alt="collection background"
              width={500}
              height={300}
              objectFit="cover"
            />
          </div>

          <div className={Style.daysComponent_box_title}>
            <h2>{el.name || "Unnamed Collection"}</h2>
            <div className={Style.daysComponent_box_title_info}>
              <div className={Style.daysComponent_box_title_info_profile}>
                <Image
                  src={el.user?.profileImage || "/img/founder1.jpg"} // Ensure profile image is fully qualified
                  alt="profile"
                  width={30}
                  height={30}
                  objectFit="cover"
                  className={Style.daysComponent_box_title_info_profile_img}
                />
                <p>
                  Creator
                  <span> {el.user?.username || "Unknown Creator"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DaysComponent;
