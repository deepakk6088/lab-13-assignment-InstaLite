const express = require("express");
const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);
  const status =
    Number.isInteger(err.status) && err.status >= 400 && err.status < 500
      ? err.status
      : 500;
  const message = status === 500 ? "Internal server error" : err.message;

  return res.status(status).json({ error: message });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
