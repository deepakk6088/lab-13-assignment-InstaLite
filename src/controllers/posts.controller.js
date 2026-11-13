const postsService = require("../services/posts.service");

async function create(req, res, next) {
  const body = req.body && typeof req.body === "object" ? req.body : {};

  if (!body.imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  try {
    const result = await postsService.createPost({
      imageUrl: body.imageUrl,
      caption: body.caption,
      location: body.location,
    });
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res) {
  const posts = await postsService.listPosts();
  res.status(200).json(posts);
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const post = await postsService.getPostById(id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.status(200).json(post);
}

async function update(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  try {
    const result = await postsService.updatePost(id, {
      caption: body.caption,
      location: body.location,
    });
    return res.status(200).json(result);
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }

    return next(err);
  }
}

async function remove(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  try {
    await postsService.deletePost(id);
    return res.status(204).send();
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }

    return next(err);
  }
}

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
};
