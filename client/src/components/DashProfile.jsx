import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";
export default function DashProfile() {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="max-w-lg w-full mx-auto p-3 text-center">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile </h1>
      <form className="flex flex-col gap-4 ">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full">
          <img
            src={user.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-gray-400 object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={user.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={user.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button outline>Update</Button>
      </form>
      <div className="my-5 text-red-500 flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
