import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/actions/userActions";
import OAuth from "../components/OAuth";

export default function Signin() {
  const [inputData, setInputData] = useState({});
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="min-h-screen mt-32">
      <div className="flex flex-col p-10 gap-6  max-w-4xl mx-auto md:flex-row">
        {/* left */}
        <div className="flex-1 ">
          <Button gradientDuoTone="purpleToPink" className="mt-6 text-3xl">
            Blog
          </Button>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quas
            nihil, rem aperiam voluptas saepe ut culpa vitae deleniti excepturi
            minima laboriosam, accusantium
          </p>
        </div>
        {/* {/ right /} */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* {/ form group email /} */}
            <div>
              <Label>Email</Label>
              <TextInput
                type="email"
                placeholder="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            {/* {/ form group password */}
            <div>
              <Label>Password</Label>
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                onChange={handleInputChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              Sign In
            </Button>
            <OAuth />
          </form>
          <div className="mt-5">
            <span>{"Don't have an account?"}</span>
            <Link to="/sign-up" className="text-blue-500">
              {loading ? (
                <>
                  <Spinner size="sm" /> <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );

  function handleInputChange(e) {
    const name = e.target.id;
    const value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!inputData.email || !inputData.password) {
      dispatch(signInFailure("complete all fields"));
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      const data = await res.json();
      if (data.status === "success") {
        dispatch(signInSuccess(data.user));
        navigate("/");
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  }
}
