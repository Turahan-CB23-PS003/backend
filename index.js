const Hapi = require("@hapi/hapi");

const init = async () => {
  // Create a new Hapi server instance
  const server = Hapi.server({
    port: 3000, // Change the port as needed
    host: '0.0.0.0',
  });

  // Define a simple route
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello, Hapi!";
    },
  });

  // Start the server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// Handle any unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

// Initialize the server
init();
