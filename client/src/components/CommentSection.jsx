import { Alert, Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const user = useSelector((state) => state.user.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment, postId: postId }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setComment("");
        setComments([...comments, data.comment]);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/v1/comment?post=${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "success") {
          setComments(data.comments);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    try {
      const res = await fetch(`/api/v1/comment/like/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.comment.likes,
                  numberOfLikes: data.comment.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdite = (comment, editedContent) => {
    setComments(
      comments.map((comment) =>
        comment._id === comment._id
          ? {
              ...comment,
              content: editedContent,
            }
          : comment
      )
    );
  };

  const handleDelete = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {user ? (
        <div className="flex gap-2 items-center my-5 text-gray-500 text-sm">
          <p>Sign is as:</p>
          <img
            src={user.profilePicture}
            alt=""
            className="w-5 h-5 rounded-full "
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{user.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {user ? (
        <form
          className="border rounded-md border-teal-500 p-3"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {error ? <Alert color="failure">{error}</Alert> : ""}
        </form>
      ) : (
        ""
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className=" border border-gray-400 py-1 px-2 rounded-md">
              {comments.length}
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdite}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}
