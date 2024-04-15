const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const fs = require("fs");
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/nonexisting", () => {
  it("404: responds with an error for non existing endpoint", () => {
    return request(app)
      .get("/api/nonexisting")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("endpoint not found");
      });
  });
});
describe("/api/topics", () => {
  it("GET 200: responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(topic.hasOwnProperty("description")).toBe(true);
        });
      });
  });
});

describe("/api", () => {
  it("GET 200: responds with a JSON representation of all the endpoints in this API ", () => {
    const expected = JSON.parse(fs.readFileSync("endpoints.json", "utf8"));
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expected);
      });
  });
});

describe("/api/articles/:article_id", () => {
  it("GET 200: responds with the corresponding article object of the id provided ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("GET 400: responds with an error if enters a bad id", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  it.only("GET 404: responds with an error if enters a non-existing id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
});
