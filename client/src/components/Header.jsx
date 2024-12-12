import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/actions/themeActions";
import { logoutSuccess } from "../redux/actions/userActions";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const user = useSelector((state) => state.user.user);
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //saerch
  const [saerchTerm, setSaerchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const keywordFromUrl = urlParams.get("keyword");
    setSaerchTerm(keywordFromUrl);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("keyword", saerchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <Navbar className="border-b-2">
      <p className="text-2xl font-semibold">JS</p>
      <form onSubmit={handleSubmit} className="order-2 hidden sm:inline">
        <TextInput
          type="text"
          rightIcon={AiOutlineSearch}
          value={saerchTerm}
          onChange={(e) => setSaerchTerm(e.target.value)}
        />
      </form>
      <Button className="order-2 sm:hidden " pill color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex order-3 md:order-4 gap-4">
        <Button
          pill
          color="gray"
          className="hidden md:inline"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={user?.profilePicture} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.username}</span>
              <span className="block truncate  text-sm font-medium ">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <button
            className="border-black border text-black hover:bg-black hover:text-white w-full py-2 uppercase rounded-lg px-4 text-sm transition-all duration-300 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </button>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse className="order-4 md:order-3">
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
