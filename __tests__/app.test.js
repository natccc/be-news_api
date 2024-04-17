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
  it("POST 201: Post a topic and return the newly added topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "new-topic",
        description: "This is a new topic",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "new-topic",
          description: "This is a new topic",
        });
      });
  });
  it("POST 400: Responds with an error when response body is invalid (invalid key)", () => {
    return request(app)
      .post("/api/topics")
      .send({
        abc:"new topic",
        description: "This is a new topic",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
});
})
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
          comment_count: 11,
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
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("GET 200: Accepts a topic query to filter articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("GET 200: Responds with an empty array if passed in a query of non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=dog")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(0);
      });
  });
  it("GET 200: Defaults to be sorted by the created_at date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("GET 200: Accepts a sort_by query that sorts the articles by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  it("GET 200: Accepts an order query that orders the articles in asc/desc ", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  it("GET 400: Responds with an error when sort_by query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid query");
      });
  });
  it("GET 400: Responds with an error when order query is invalid", () => {
    return request(app)
      .get("/api/articles?order=dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid query");
      });
  });
  it("POST 201: Posts an article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Cats rule the world",
        topic: "cats",
        author: "butter_bridge",
        body: "Cutest animals on earth",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          title: "Cats rule the world",
          topic: "cats",
          author: "butter_bridge",
          body: "Cutest animals on earth",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          article_id: expect.any(Number),
          comment_count: 0,
        });
      });
  });
  it("POST 400: Responds with an error when the response body is not of correct format (not providing all properties needed)", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Cats rule the world",
        topic: "cats",
        author: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  it("POST 404: Responds with an error when the response body is not of correct format (topic/author does not exist)", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Cats rule the world",
        topic: "dog",
        author: "butter_bridge",
        body: "Cutest animals on earth",
        created_at: expect.any(String),
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        article_id: expect.any(Number),
        comment_count: 0,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  it("GET 200: Limit the number of responses, default to 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  it("GET 200: Accept a query of limit to limit the number of responses", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
      });
  });
  it("GET 400: Responds with an error when limit is not a number", () => {
    return request(app)
      .get("/api/articles?limit=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid query");
      });
  });
  it("GET 200: Accepts a p query that specifies the page at which to start, with the total_count property", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(3);
        expect(body.articles[0].created_at).toBe("2020-04-17T01:08:00.000Z");
      });
  });
  it("GET 200: Accepts multiple queries", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2&sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).toBe(8);
        expect(body.total_count).toBe(5);
      });
  });
  it("GET 400: Responds with an error when p is not a number", () => {
    return request(app)
      .get("/api/articles?p=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid query");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("GET 200: Responds with an array of comments associated with the article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
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
  it("GET 200: Responds with an array of comments, default to limit 10", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
      });
  });
  it("GET 200: Accepts a query of limit to limit the number of comments", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(5);
      });
  });
  it("GET 400: Responds with an error when limit is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid query");
      });
  });
  it("GET 200: Accepts a query of p that specifies the page at which to start", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(1);
        expect(comments[0].comment_id).toBe(9);
      });
  });
  it("GET 400: Responds with an error when p is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid query");
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
  it("PATCH 200: Updates a comment associated with the comment_id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: 100,
      })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 116,
          author: "butter_bridge",
          created_at: "2020-04-06T12:17:00.000Z",
          article_id: 9,
        });
      });
  });
  it("PATCH 404: Responds with an error when comment_id is valid but non-existent", () => {
    return request(app)
      .patch("/api/comments/100")
      .send({
        inc_votes: 100,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("comment_id not found");
      });
  });
  it("PATCH 400: Responds with an error when comment_id is of invalid type", () => {
    return request(app)
      .patch("/api/comments/dog")
      .send({
        inc_votes: 100,
      })
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
describe("/api/users/:username", () => {
  it("GET 200: Responds with a user by username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  it("GET 404: Responds with an error when username is non-existent", () => {
    return request(app)
      .get("/api/users/dog")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("user not found");
      });
  });
});
