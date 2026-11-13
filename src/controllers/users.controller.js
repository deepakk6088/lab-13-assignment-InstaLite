const usersService = require("../services/users.service");

async function create(req, res, next) {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (!body.username || !body.email || !body.fullname) {
      return res
        .status(400)
        .json({ error: "username, email and fullname are required" });
    }

    const result = await usersService.createUser({
      username: body.username,
      email: body.email,
      fullname: body.fullname,
      bio: body.bio,
    });
    return res.status(201).json(result);
  } catch (err) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }

    return next(err);
  }
}

async function list(req, res) {
  const users = await usersService.listUsers();
  res.status(200).json(users);
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const user = await usersService.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
}

async function update(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  try {
    const result = await usersService.updateUser(id, {
      fullname: body.fullname,
      bio: body.bio,
      isPrivate: body.isPrivate,
    });
    return res.status(200).json(result);
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
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
    await usersService.deleteUser(id);
    return res.status(204).send();
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
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
