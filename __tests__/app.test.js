const app = require('../app')
const request = require('supertest')
const db= require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const fs = require('fs')
beforeEach(()=>seed(data))
afterAll(()=>db.end())

describe('/api/nonexisting', () => {
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

describe('/api', () => {
    it('GET 200: responds with a JSON representation of all the endpoints in this API ', () => {
        const expected = JSON.parse(fs.readFileSync('endpoints.json', 'utf8'))
        console.log(expected)
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            console.log(body)
        expect(body).toEqual(expected)
        })
    });
});