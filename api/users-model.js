const db = require("../data/dbConfig");

module.exports = {
  get,
  getById,
  insert,
  remove,
};

function get() {
  return db("users");
}

function getById(id) {
  return db("users").where("id", id).first();
}

async function insert(user) {
  const [id] = await db("users").insert(user);
  return db("users").where({ id }).first();
}

async function remove(id) {
  return db("users").where("id", id).del();
}
