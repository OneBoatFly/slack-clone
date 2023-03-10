import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NavBarLoggedIn from "../NavBarLoggedIn";
import SideBar from "../SideBar/SideBar";
import Footer from "../Footer/Footer";
import { getAllChannel } from "../../store/channels";
import AllChannelsMap from "./AllChannelsMap";
import { getCurrentUserGroupsThunk } from "../../store/groups";

export default function AllChannels() {
  // console.log("--------All Channels Page--------");
  const user = useSelector((state) => state.session.user);

  const sideBarRef = useRef(null);
  const sideBarClick = () => {
    if (sideBarRef.current.className.includes('showSideBar')) {
      sideBarRef.current.classList.remove('showSideBar');
      return;
    }
    sideBarRef.current.classList.add('showSideBar');
  }

  console.log('sideBarRef', sideBarRef)

  return (
    <div className="landing-grid">
      <div className="grid-nav-top-mobile">
        <div className="grid-nav-top-mobile-wrapper" onClick={sideBarClick}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>         
      <div className="grid-nav-top">
        <NavBarLoggedIn user={user} />
      </div>
      <div className="grid-sidebar" ref={sideBarRef}>
        <SideBar user={user} />
      </div>
      <div className="grid-main-view">
        <div className="channel-banner-div channel-banner-div-all-channel">
          <div className="channel-name">All channels</div>
        </div>
        <AllChannelsMap />
      </div>
      <div className="grid-footer">
        <Footer />
      </div>
    </div>
  );
}
