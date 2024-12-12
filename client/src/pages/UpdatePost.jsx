import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//
import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePost() {
  //publish
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({});

  //navigate
  const navigate = useNavigate();
  const { postId } = useParams();

  // image upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); //track progress of image 0-100
  const [imageFileUploading, setImageFileUploading] = useState(false); //check if image is uploading
  const [imageFileUploadError, setImageFileUploadError] = useState(null); //error message

  const [file, setFile] = useState(null);
  //input file change
  const handleImageChange = () => {
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
            image: downloadURL,
          });
          setImageFileUploading(false);
          setImageFileUploadProgress(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      setPublishError("All fields are required");
      return;
    }

    try {
      setPublishError(null);
      setPublishSuccess(null);
      const res = await fetch(`/api/v1/post/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.status === "success") {
        setPublishSuccess("Post Updated successfully");
        setPublishError(null);
        setPublishError(null);
        setFormData({});
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
        setImageFileUploadError(null);
        setFile(null);
        // navigate(`/post/${data.post.slug}`);
      }
    } catch (err) {
      setPublishError(err.message);
      console.log(err);
    }
  };

  //get post by id
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/v1/post?_id=${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "success") {
          setFormData(data.posts[0]);
          setPublishError(null);
        }
      } catch (err) {
        setPublishError(err.message);
      }
    };

    getPost();
  }, [postId]);

  console.log(formData);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl text-center my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            className="flex-1"
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                [e.target.id]: e.target.value,
              });
            }}
          />{" "}
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            id="category"
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React JS</option>
            <option value="nextjs">Next JS</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3 border-teal-500">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            outline
            onClick={handleImageChange}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <CircularProgressbar
                className="w-16 h-16"
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
              />
            ) : (
              " Upload image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.image ? (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        ) : (
          ""
        )}
        <ReactQuill
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write something..."
          required
          value={formData.content}
          onChange={(value) => {
            setFormData({
              ...formData,
              content: value,
            });
          }}
        />
        <Button type="submit" outline gradientDuoTone="purpleToPink">
          Update Post
        </Button>
      </form>
      {publishError && <Alert color="failure">{publishError}</Alert>}
      {publishSuccess && <Alert color="success">{publishSuccess}</Alert>}
    </div>
  );
}
