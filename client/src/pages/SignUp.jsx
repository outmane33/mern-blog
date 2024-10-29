import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";

export default function SignUp() {
  const [inputData, setInputData] = useState({});
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loding, setLoding] = useState(false);
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
        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {/* form group username */}
            <div>
              <Label>UserName</Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleInputChange}
              />
            </div>
            {/* form group email */}
            <div>
              <Label>Email</Label>
              <TextInput
                type="email"
                placeholder="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            {/* form group */}
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
              className="w-full mt-5"
              type="submit"
              disabled={loding}
            >
              Sign Up
            </Button>
          </form>
          <div className="mt-5">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              {loding ? (
                <>
                  <Spinner size="sm" /> <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
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

    if (!inputData.username || !inputData.email || !inputData.password) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      setLoding(true);
      setErrorMessage(null);
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      const data = await res.json();
      if (data.status === "success") {
        setLoding(false);
        navigate("/sign-in");
      } else {
        setErrorMessage(data.message);
        return;
      }
    } catch (err) {
      setErrorMessage(err.message);
      setLoding(false);
      console.log(err);
    }
  }
}
