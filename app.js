require('dotenv').config();
const express = require('express');
const expresslayout=require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

//connection mongodb
const connectDB=require('./server/config/db');
const {isActiveRoute} = require('./server/helpers/routeHelpers');
const port = 3000||process.env.port;

//static files
app.use(express.static('public'));

//Template engine
app.use(expresslayout);
app.set('view engine','ejs');
app.set('layout','./layouts/main');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),

}));
//call connectDB
connectDB();

app.locals.isActiveRoute=isActiveRoute;

//routing to server/routes
app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});
