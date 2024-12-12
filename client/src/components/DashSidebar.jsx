import { Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmDown,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/actions/userActions";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/v1/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={user.isAdmin ? "admin" : "user"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {user.isAdmin ? (
            <>
              {/* dash */}
              <Link to={"/dashboard?tab=dash"}>
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as={"div"}
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              {/* posts  */}
              <Link to={"/dashboard?tab=posts"}>
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as={"div"}
                >
                  Posts
                </Sidebar.Item>
              </Link>
              {/* users */}
              <Link to={"/dashboard?tab=users"}>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as={"div"}
                >
                  Users
                </Sidebar.Item>
              </Link>
              {/* comments */}
              <Link to={"/dashboard?tab=comments"}>
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as={"div"}
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          ) : null}
          <Sidebar.Item
            icon={HiArrowSmDown}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
