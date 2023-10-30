import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize'
import cookieParse from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import compression from 'compression'

//dotenv config
dotenv.config()

//create express app 
const app = express()

if(process.env.NODE_ENV!=="production"){
    app.use(morgan('dev'))
}

//parse json request body
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//sanitize request data
app.use(mongoSanitize())

//enable cookie parser
app.use(cookieParse())


//helmet
app.use(helmet())


//gzip compression 
app.use(compression())


//file upload
app.use(fileUpload({
    useTempFiles:true
}))

//cors
app.use(cors())




export default app
