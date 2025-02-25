const express = require("express");
const router = express.Router();
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../Controllers/user");

/*
  Way to combine or Group similar route but with different 
  Methods
  */

//Get and Post
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

//Get, Delete, Patch
router
  .route("/:id")
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById)
  .get(handleUpdateUserById);

module.exports = router;
