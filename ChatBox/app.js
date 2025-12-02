const express = require('express')
const app = express()
const cors = require('cors');
const port = 8080
require("dotenv").config();
require('./src/config/db');
const adminRouter = require("./src/router/AdminRouter");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use("/api", adminRouter);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
