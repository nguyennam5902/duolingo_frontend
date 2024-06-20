const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    // apply proxy in dev mode
    // if (dev) {
    server.use(
      "/api",
      createProxyMiddleware({
        target: "https://duolingo-backend.onrender.com/",
        // target: "http://localhost:3000/",
        changeOrigin: true,
      })
    );
    // }

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(8000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:8000");
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });