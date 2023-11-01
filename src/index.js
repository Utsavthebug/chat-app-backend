import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.config.js";

//env variables
const PORT = process.env.PORT || 8000
const {DATEBASE_URL} = process.env

//handke errors after initial connection 
mongoose.connection.on('error',err =>{
    logger.error(`Mongodb connection error : ${err}`)
    process.exit(1)
})


//mongodb connection
mongoose.connect(DATEBASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    logger.info('Connected to mongodb')
  })

//mongodb debug mode
if(process.env.NODE_ENV==='development'){
    mongoose.set('debug',true)
}


let server;

server = app.listen(PORT,()=>{
   logger.info(`Server is listening at ${PORT}...`)
})

const exitHandler = ()=>{
    if(server){
        logger.info("Server closed")
        process.exit(1)
    }
    else{
        process.exit(1)
    }
}

//handle server errors 
const unexpectedErrorHandler  = (error) =>{
    logger.error(error)
    exitHandler()
}


process.on('uncaughtException',unexpectedErrorHandler)
process.on('unhandledRejection',unexpectedErrorHandler)

//SIGTERM 
process.on('SIGTERM',()=>{
    if(server){
        logger.info('Server closed')
        process.exit(1)
    }
})