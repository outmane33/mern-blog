import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/v1/post?limit=9", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setPosts(data.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Wecome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here {"you'll"} find a variety of articles and tutorials on topics
          such as web development, software engineering, and programming
          languages.
        </p>
        <Link
          to={"/search"}
          className="text-teal-500 text-xs sm:text-sm hover:underline font-bold"
        >
          View all posts
        </Link>
      </div>

      <div className="p-3  dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-center font-semibold">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link className="text-lg text-teal-500 text-center hover:underline">
              View all posts
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
