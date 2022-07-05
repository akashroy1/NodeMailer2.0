const express = require('express')

const app = express()

// Routers
const mainRouter = require("./routes/mainRouter")

// Middlewares
app.use(express.json())
app.set("view engine", "ejs")

app.use("/", mainRouter)

module.exports = app