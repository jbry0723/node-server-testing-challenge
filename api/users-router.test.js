const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

const user1 = { username: "bob", password: "1234" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe("server", () => {
  describe("[GET] /api/users", () => {
    it("responds with 200 ok", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).toEqual(200);
    });
    it("returns an array of users", async () => {
      let res;
      await db("users").insert(user1);
      res = await request(server).get("/api/users");
      expect(res.body).toHaveLength(1);
    });
  });
  describe("[POST] /api/users", () => {
    it("responds with newly created user", async () => {
      let res;
      res = await request(server).post("/api/users").send(user1);
      expect(res.body).toMatchObject({ id: 1, ...user1 });
    });
    it("adds user to database", async () => {
      let res;
      await request(server).post("/api/users").send(user1);
      res = await request(server).get("/api/users");
      expect(res.body[0]).toMatchObject({ id: 1, ...user1 });
    });
  });
  describe("[DELETE] api/users", () => {
    it("returns 1 on succcess", async () => {
      let res;
      await request(server).post("/api/users").send(user1);
      res = await request(server).delete("/api/users/1");
      expect(res.body).toEqual(1);
    });
    it("removes target from the database", async () => {
      let res;
      await request(server).post("/api/users").send(user1);
      res = await request(server).get("/api/users");
      expect(res.body).toHaveLength(1);
      await request(server).delete("/api/users/1");
      res = await request(server).get("/api/users");
      expect(res.body).toHaveLength(0);
    });
  });
});
