import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const loggedUser = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.user}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setUser(data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [comment]);
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
    console.log("edit");
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setIsEditing(false);
        setEditedContent(data.comment.content);
        onEdit(comment, data.comment.content);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/comment/${comment._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        onDelete(comment._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "Anonymous"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end text-xs">
              <Button
                gradientDuoTone="purpleToBlue"
                type="button"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                outline
                gradientDuoTone="purpleToBlue"
                type="button"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              {/* button for like */}
              <button
                className={`text-gray-400 hover:text-blue-500 ${
                  loggedUser && comment.likes.includes(loggedUser._id)
                    ? "!text-blue-500"
                    : "text-gray-400"
                }`}
                onClick={() => {
                  onLike(comment._id);
                }}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes > 1 ? "likes" : "like")}
              </p>
              {loggedUser &&
                (loggedUser._id === comment.user || loggedUser.isAdmin) && (
                  <>
                    <button
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>

                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => setShowModal(true)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3>Are you sure you want to delete this comment?</h3>
            <div className="mt-4 flex justify-center gap-6">
              <Button color="failure" onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                {"No, Cancel"}{" "}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
