import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto border-4 rounded-tl-3xl rounded-br-3xl p-4 sm:flex-row">
      <div className="p-7 flex-1">
        <h2 className="text-black text-2xl text-center dark:text-white">
          Want to learn HTML, CSS and Javascript by building fun and engaging
          projects?
        </h2>

        <p className="pt-7 text-center text-gray-500 text-lg">
          check our 100 js projects website and start buildind your own projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="mt-4 w-full rounded-tl-xl rounded-br-xl  rounded-tr-none rounded-bl-none"
        >
          100 JS Projects Website
        </Button>
      </div>
      <div className="p-7  flex-1">
        <img
          src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png"
          alt=""
        />
      </div>
    </div>
  );
}
