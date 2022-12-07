const express = require("express")
const cors = require("cors")
const app = express()
const userController = require("./controllers/user.controller.js")

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//api
app.get("/users", userController.allUser)
app.get("/users/me", userController.authorized)
app.get("/users/:id", userController.findUser)
app.post("/users/login", userController.login)
app.post("/users/signup", userController.signup)

app.listen(8000)
