import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardCom from "../components/DashboardCom";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}

      {/* posts */}
      {tab === "posts" && <DashPost />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments */}
      {tab === "comments" && <DashComments />}
      {/* Dashboard com */}
      {tab === "dash" && <DashboardCom />}
    </div>
  );
}
