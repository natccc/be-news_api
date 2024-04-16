const express = require('express')
const app = express()
const {getTopics,} = require('./controllers/topics-controllers')
const{getArticleById, getArticles, patchArticle}=require('./controllers/articles-controllers')
const{getEndpoints}= require('./controllers/api-controllers')
const {getComments, postComment, deleteComment} = require('./controllers/comments-controllers')

app.use(express.json())
app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)
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

 //posting comment to non existing id
 app.use((err,req,res,next)=>{
    if(err.code==="23503"){
        res.status(404).send({message: "not found"})
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