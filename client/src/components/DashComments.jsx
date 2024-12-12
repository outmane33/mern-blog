import { Button, Modal, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashComments() {
  const user = useSelector((state) => state.user.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await fetch(`/api/v1/comment`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "success") {
          setComments(data.comments);
          setLimit(data.results);

          if (data.results < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllComments();
  }, [user._id]);

  const handleShowMore = async () => {
    try {
      //incerement limit by 5
      const res = await fetch(`/api/v1/comment?limit=${limit + 5}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        setComments(data.comments);
        setLimit(data.results);
        console.log(data);
        if (!data.paginationResult.next) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/comment/${deleteCommentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        //update comments
        const newComments = comments.filter(
          (comment) => comment._id !== deleteCommentId
        );
        setComments(newComments);
        setLimit(limit - 1);
        if (newComments.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number Of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/user/${comment.slug}`}>{comment.content}</Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Link
                      to={`/user/${comment.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      <p>{comment.numberOfLikes}</p>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{comment._id}</Table.Cell>
                  <Table.Cell>{comment.user}</Table.Cell>
                  <Table.Cell>
                    {" "}
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setDeleteCommentId(comment._id);
                      }}
                    >
                      Delete
                    </span>{" "}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="text-teal-500 self-center w-full py-5"
              onClick={handleShowMore}
            >
              show more
            </button>
          )}
        </>
      ) : (
        <p>you have no comments yet</p>
      )}
      <Modal
        show={showModal}
        popup
        size="md"
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3>Are you sure you want to delete this comment?</h3>
            <div className="mt-4 flex justify-center gap-6">
              <Button color="failure" onClick={handleDeleteComment}>
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
