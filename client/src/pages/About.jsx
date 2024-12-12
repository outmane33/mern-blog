export default function About() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="">
          <h1 className="text-3xl font-semibold text-center my-7">
            About JS Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to JS Blog! This blog is a personal project created by
              [Your Name] to share insights, tips, and tutorials about the
              fascinating world of JavaScript. As a passionate developer, I aim
              to make this space a resource for anyone looking to deepen their
              understanding of coding, web development, and modern programming
              practices.
            </p>

            <p>
              On JS Blog, {"you'll"} find regular posts covering a wide range of
              topics such as JavaScript frameworks, coding best practices, and
              hands-on tutorials for building real-world projects. {"I'm"}{" "}
              always experimenting with new tools and technologies, so expect
              fresh and relevant content that keeps up with the rapidly evolving
              tech landscape.
            </p>

            <p>
              We invite you to join the conversation! Leave comments, share your
              thoughts, and engage with a growing community of like-minded
              developers. By learning together and sharing knowledge, we can
              push the boundaries of {"what's"} possible in JavaScript
              development. Stay tuned for updates, and {"let's"} code our way to
              success!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
