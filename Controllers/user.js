const User = require("../Models/user");

async function handleGetAllUsers(req, res) {
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
}

async function handleGetUserById(req, res) {
  const id = Number(req.params.id);
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, {
    lastName: "Changed",
  });
  return res.json({ status: "Pending" });
}

async function handleDeleteUserById(req, res) {
  const id = Number(req.params.id);
  await User.findByIdAndDelete(id);
  res.status(201).json({ success: "User deleted" });
}

async function handleCreateNewUser(req, res) {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.email ||
    !body.gender ||
    !body.job_title ||
    !body.last_name
  ) {
    res.status(400).json({ msg: "All Fields are required..." });
  }

  await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobtTitle: body.job_title,
  });

  return res.status(201).json({ status: "Success" });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
