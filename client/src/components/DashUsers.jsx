import { Button, Modal, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const user = useSelector((state) => state.user.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await fetch(`/api/v1/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "success") {
          setUsers(data.users);
          setLimit(data.results);

          if (data.results < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, [user._id]);

  const handleShowMore = async () => {
    try {
      //incerement limit by 5
      const res = await fetch(`/api/v1/post?limit=${limit + 5}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        setUsers(data.users);
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

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/user/${deleteUserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        //update users
        const newUsers = users.filter((user) => user._id !== deleteUserId);
        setUsers(newUsers);
        setLimit(limit - 1);
        if (newUsers.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((logUser) => (
              <Table.Body key={logUser._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(logUser.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/user/${logUser.slug}`}>
                      <img
                        src={logUser.profilePicture}
                        alt={logUser.username}
                        className="w-12 h-12 object-cover bg-gray-500 rounded-full"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Link
                      to={`/user/${logUser.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {logUser.username}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{logUser.email}</Table.Cell>
                  <Table.Cell>
                    {logUser.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setDeleteUserId(logUser._id);
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
        <p>you have no users yet</p>
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
            <h3>Are you sure you want to delete this user?</h3>
            <div className="mt-4 flex justify-center gap-6">
              <Button color="failure" onClick={handleDeleteUser}>
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
