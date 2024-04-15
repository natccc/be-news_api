const express = require('express')
const app = express()
const {getTopics,} = require('./controllers/topics-controllers')
const{getArticleById, getArticles, getComments}=require('./controllers/articles-controllers')
const{getEndpoints}= require('./controllers/api-controllers')

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getComments)

//error handling by express
app.all('*',(req,res,next)=>{
    res.status(404).send({message: "endpoint not found"})
})

//psql errors
app.use((err,req,res,next) => {
    if(err.code==="23502" || err.code==="22P02"){
     res.status(400).send({message: "bad request"})
    }
    next(err)
 })

 //custom error handling
app.use((err,req,res,next)=>{
    if(err.status && err.message){
        res.status(err.status).send({message: err.message})
    }
    next(err)
})
app.use((err,req,res,next)=>{
    res.status(500).send({message: "internal server error"})
    })


module.exports = app