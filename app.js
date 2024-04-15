const express = require('express')
const app = express()
const {getTopics, getEndpoints} = require('./controllers/topics-controllers')

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)



//error handling by express
app.all('*',(req,res,next)=>{
    res.status(404).send({message: "endpoint not found"})
})

app.use((err,req,res,next)=>{
    res.status(500).send({msg: "internal server error"})
    })


module.exports = app