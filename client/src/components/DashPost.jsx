import { Button, Modal, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPost() {
  const user = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const res = await fetch(`/api/v1/post?user=${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "success") {
          setPosts(data.posts);
          setLimit(data.results);

          if (data.results < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllPosts();
  }, [user._id]);

  const handleShowMore = async () => {
    try {
      //incerement limit by 5
      const res = await fetch(
        `/api/v1/post?user=${user._id}&limit=${limit + 5}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        setPosts(data.posts);
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

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/post/${deletePostId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        //update posts
        const newPosts = posts.filter((post) => post._id !== deletePostId);
        setPosts(newPosts);
        setLimit(limit - 1);
        if (newPosts.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    {" "}
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setDeletePostId(post._id);
                      }}
                    >
                      Delete
                    </span>{" "}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      {" "}
                      <span className="text-teal-500 hover:underline">
                        Edit
                      </span>{" "}
                    </Link>
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
        <p>you have no posts yet</p>
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
            <h3>Are you sure you want to delete your account?</h3>
            <div className="mt-4 flex justify-center gap-6">
              <Button color="failure" onClick={handleDeletePost}>
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
