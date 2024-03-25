import express from "express";
import { Request, Response, NextFunction } from "express";
import * as http from "http";
import { config } from "./config/config";
import { DB } from "./models/db";
import * as logger from "./models/logs";
import errorHandler from "errorhandler";
import { access } from "fs";
import * as fs from "fs";
// import ExpressValidator from "express-validator";
var expressValidator = require("express-validator");

var cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:8080", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specified HTTP methods
    allowedHeaders: ["Content-Type"],
  })
);

const server = http.createServer(app);
const db = new DB();

const port = config.port || 7000;
const mongodbURI: string = config.mongodbURI;
const LABEL = config.serviceName;

app.set("port", port);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// ExpressValidator

app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use("/test", (req, res) => {
  res.send(config.serviceName + " is LIVE");
});

//   route access

app.use("/v1", require("./routes/apiRoutes")); //dynamic CRUD management

// Bring in the database!
db.connectWithRetry(mongodbURI);

server.listen(port, () => {
  console.log(LABEL + " is running on port " + port);
});

//catch 404 and forward to error handler
app.use(function (req: Request, res: Response | any, next: NextFunction) {
  res.status(404).send("Page/Api Not Found");
  return;
});

module.exports = app;
