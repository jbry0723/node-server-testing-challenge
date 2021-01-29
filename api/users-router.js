const express = require("express");

const Users = require("./users-model");

const router = express.Router();

router.get("/", (req, res, next) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  Users.remove(req.params.id)
    .then((removed) => {
      res.status(200).json(removed);
    })
    .catch(next);
});

router.use((error, req, res) => {
  res
    .status(500)
    .json({
      info: "There was an error in the router",
      message: error.message,
      stack: error.stack,
    });
});

module.exports = router;
