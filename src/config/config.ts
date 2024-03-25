require('dotenv').config();


export let config = {
  serviceName: process.env.SERVICE_NAME || "API_SERVICE",
  // mongodbURI:process.env.MONGO_DB_URI || "mongodb://localhost:27017/GenericApi",
  mongodbURI:
    process.env.MONGO_DB_URI ||
    "mongodb+srv://sp348770:Z0qFxqZa1Nx5fl67@cluster00.m2v7wzq.mongodb.net/",
  port: process.env.PORT || 7050,
  dynamicModels: new Array(),
};