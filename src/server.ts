import { createApp } from "./app"; // Import the app creation function

const startServer = async () => {
  const server = await createApp(); // Create the app instance
  try {
    await server.listen({
      port: Number(process.env.PORT) || 9000,
    });
    console.log(`HTTP server running on http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
