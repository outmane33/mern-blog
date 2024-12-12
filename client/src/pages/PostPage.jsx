import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Spinner, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        setUploadError(null);
        setLoading(true);
        const res = await fetch(`/api/v1/post?slug=${postSlug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setPost(data.posts[0]);
          setLoading(false);
          setUploadError(null);
        }
      } catch (err) {
        setUploadError(err.message);
        setLoading(false);
        console.log(err);
      }
    };

    getPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        const res = await fetch(`/api/v1/post?limit=3`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setRecentPosts(data.posts);
        }
      };

      getRecentPosts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="flex flex-col p-3 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center max-w-3xl font-serif mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 max-h-[600px] w-full object-cover p-3"
      />
      <div className="flex justify-between p-3 border-b border-[#c99484] text-xs mx-auto w-full max-w-2xl">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="mx-auto w-full max-w-4xl">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />

      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap mt-5 gap-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard post={post} key={post._id} />)}
        </div>
      </div>
    </main>
  );
}
