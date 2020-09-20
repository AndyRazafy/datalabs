const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require('./routes/api/routes');

const app = express();

app.use(cors());
app.options('*', cors());

// Body parser middleware
app.use(bodyParser.json());

// Db config
const db = require("./config/keys").mongoURI

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to Mongodb..."))
    .catch(err => console.log(err));

// Use routes
app.use("/api/", routes);

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server started on port ${port}`));