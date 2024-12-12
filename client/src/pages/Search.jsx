import { Button, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    keyword: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const keywordFromUrl = urlPrams.get("keyword");
    const sortFromUrl = urlPrams.get("sort");
    const categoryFromUrl = urlPrams.get("category");
    if (keywordFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        keyword: keywordFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/post?${urlPrams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setPosts(data.posts);
          setLimit(data.results);
          setLoading(false);
          if (data.results < 9) {
            setShowMore(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "keyword") {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "category") {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("keyword", sidebarData.keyword);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams();
    urlParams.set("keyword", sidebarData.keyword);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    urlParams.set("limit", limit + 5);
    navigate(`/search?${urlParams.toString()}`);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 borer-b md:border-r md:min-h-screen border-gray-700">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* search */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="keyword"
              type="text"
              value={sidebarData.keyword}
              onChange={handleChange}
            />
          </div>
          {/* sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
              <option value="asc">Latest</option>
              <option value="desc">Oldest</option>
            </Select>
          </div>
          {/* category */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              id="category"
              value={sidebarData.category}
            >
              <option value="uncategorized">uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="nextjs">Next.Js</option>
              <option value="reactjs">React.Js</option>
            </Select>
          </div>
          <button
            type="submit"
            className="border-[#c99484] border text-[#c99484] hover:bg-[#c99484] hover:text-white w-full py-2 uppercase"
          >
            Apply Filter
          </button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Post Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 ? (
            <p className="text-xl text-gray-500">No posts found</p>
          ) : (
            ""
          )}
          {loading ? <p className="text-xl text-gray-500">Loading</p> : ""}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard post={post} key={post._id} />)}
          {showMore && (
            <button
              className="text-xl text-teal-500 p-7 w-full"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
