const app = require('../app')
const request = require('supertest')
const db= require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

beforeEach(()=>seed(data))
afterAll(()=>db.end())

describe('/api', () => {
    it('404: responds with an error for non existing endpoint', () => {
        return request(app)
        .get('/api/nonexisting')
        .expect(404)
        .then(({body})=>{
            expect(body.message).toBe("endpoint not found")
        })
    });
});
describe('/api/topics', () => {
    it('GET 200: responds with an array of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
            const {topics}= body
            topics.forEach(topic=>{
                expect(topic.hasOwnProperty('slug')).toBe(true)
                expect(topic.hasOwnProperty('description')).toBe(true)
            })
        })
    });
});