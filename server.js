const express = require("express")
const router = require("./routes/route")
const Connect = require("./Config/Db")
require("dotenv").config()
const app = express()

app.use(express.json())

app.use("/api/v1", router)

Connect(app)