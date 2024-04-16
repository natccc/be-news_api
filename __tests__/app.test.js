const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("undeclared endpoint", () => {
  it("404: Responds with an error for non existing endpoint", () => {
    return request(app)
      .get("/api/nonexisting")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("endpoint not found");
      });
  });
});
describe("/api", () => {
  it("GET 200: Responds with a JSON representation of all the endpoints in this API ", () => {
    // const expected = JSON.parse(fs.readFileSync("endpoints.json", "utf8"));
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(require("../endpoints.json"));
      });
  });
});
describe("/api/topics", () => {
  it("GET 200: Responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("/api/articles/:article_id", () => {
  it("GET 200: Responds with the an array of articles associated with the article_id ", () => {
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
  it("GET 400: Responds with an error when article_id is of incorrect type", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  it("GET 404: Responds with an error when article_id is valid but non-existent", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article_id not found");
      });
  });
  it("PATCH 200: Updates the vote of the article associated with the article_id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1000 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 1100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("PATCH 404: Responds with an error when article_id is valid but non-existent", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 1000 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article_id not found");
      });
  });
  it("PATCH 400: Responds with an error when article_id is of invalid type", () => {
    return request(app)
      .patch("/api/articles/dog")
      .send({ inc_votes: 1000 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  it("PATCH 400: Responds with en error when the response body is not of correct format (incorrect value type)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  it("PATCH 400: Responds with en error when the response body is not of correct format (incorrect column name)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ banana: 1000 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});
describe("/api/articles", () => {
  it("GET 200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            article_id: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  it("GET 200: Responds with an array of comments associated with the article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  it("GET 200: Responds with an empty array when article_id exist but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  it("GET 404: Responds with an error when article_id is valid but non-existent", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article_id not found");
      });
  });
  it("GET 400: Responds with an error when article_id is of invalid type", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });

  it("POST 201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is a test comment",
          votes: 0,
          author: "butter_bridge",
          created_at: expect.any(String),
          article_id: 1,
        });
      });
  });
  it("POST 404: Responds with an error when article_id is valid but non-existent", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send({
        username: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  it("POST 400: Responds with an error when article_id is of invalid type", () => {
    return request(app)
      .post("/api/articles/dog/comments")
      .send({
        username: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  it("POST 400: Responds with en error when the response body is not of correct format (incorrect column name)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        banana: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  it("DELETE 204: Delete a comment associated with the comment_id)", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("DELETE 404: Responds with an error when comment_id is valid but non-existent", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("comment_id not found");
      });
  });
  it("DELETE 400: Responds with an error when comment_id is of invalid type", () => {
    return request(app)
      .delete("/api/comments/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});
describe("/api/users", () => {
  it("GET 200: Responds with an array of all users ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
