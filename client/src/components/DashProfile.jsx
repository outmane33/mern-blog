import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  logoutSuccess,
} from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function DashProfile() {
  //update user
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  //delete user
  const [showModal, setShowModal] = useState(false);

  // image upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); //track progress of image 0-100
  const [imageFileUploading, setImageFileUploading] = useState(false); //check if image is uploading
  const [imageFileUploadError, setImageFileUploadError] = useState(null); //error message
  //input file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    //file must be an image
    if (!file.type.includes("image")) {
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploadError("Please select an image file ");
      return;
    }
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  //when image is uploaded
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //upload image to firebase
  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        imageFileUrl(null);
        setImageFileUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({
            ...formData,
            profilePicture: downloadURL,
          });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }

    if (imageFileUploading) {
      dispatch(updateFailure("Image is still uploading"));
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/v1/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "success") {
        dispatch(updateSuccess(data.user));
        setUpdateUserSuccess("Profile updated successfully");
      } else {
        dispatch(updateFailure(data.message));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error);
    }
  };

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

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/v1/user/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        dispatch(deleteSuccess());
      } else {
        dispatch(deleteFailure(data.message));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
      console.log(error);
    }
  };
  return (
    <div className="max-w-lg w-full mx-auto p-3 text-center">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile </h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(52, 162, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || user.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-gray-400 object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={user.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={user.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button outline type="submit">
          Update
        </Button>
      </form>
      <div className="my-5 text-red-500 flex justify-between">
        <span
          className="cursor-pointer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
      <br />
      {error && <Alert color="failure">{error}</Alert>}
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
            <h3>Are you sure you want to delete your account?</h3>
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
