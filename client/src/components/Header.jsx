import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Header() {
  const path = useLocation().pathname;
  const user = useSelector((state) => state.user.user);
  console.log(user);
  return (
    <Navbar className="border-b-2">
      <Button className="order-1" gradientDuoTone="purpleToPink">
        Blog
      </Button>
      <TextInput
        type="text"
        rightIcon={AiOutlineSearch}
        className="order-2 hidden sm:inline"
      />
      <Button className="order-2 sm:hidden " pill color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex order-3 md:order-4 gap-4">
        <Button pill color="gray" className="hidden md:inline">
          <FaMoon />
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
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button gradientDuoTone="purpleToBlue" outline>
            Sign In
          </Button>
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
