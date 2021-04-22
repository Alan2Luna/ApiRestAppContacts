const express = require('express')
const cors = require('cors')

// initializations
const app = express()

// settings |configuraciones que necesita el servidor express
app.set('port', process.env.PORT || 4000)

// middlewares
app.use(cors({
    origin: "https://appcontacts.vercel.app/",
    optionsSuccessStatus: 200,
    credentials: true,
    methods:  "GET, PUT, POST, DELETE"
}))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Global Variables
app.use((req, res, next) => {
    next();
})

// Routes
app.use(('/api/'), require('./routes/authetication'))
app.use(('/api/contacts'), require('./routes/contacts'))

// Starting the server
app.listen(app.get('port'))