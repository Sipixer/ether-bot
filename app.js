const fs = require('fs')
    //Mise en cache de la config générale
global.config = JSON.parse(fs.readFileSync('config.json'))
    //Mise en place des require
const express = require('express')
const path = require("path")
const session = require('express-session');
const pageRouter = require('./routes/pages');
const bodyParser = require('body-parser')





//Initialisation du bot discord 
const Discordapp = require('./discordapp.js')


//Initialisation de la partie web
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
var cors = require('cors')

// session
app.use(session({
    secret: 'hcfdvfg',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 60
    }
}));

app.use(cors())
app.use(bodyParser.text({ type: "text/plain" }));

// Routers
app.use('/', pageRouter);


// Errors => page not found 404
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});


const port = global.config.web.port

app.get('/', (req, res) => res.render("index.ejs"))
app.listen(port, () => console.log(`Le site est lancé -> http://localhost:` + port))






module.exports = app;