require('dotenv').config();


export let config = {
  serviceName: process.env.SERVICE_NAME || "API_SERVICE",
  // mongodbURI:process.env.MONGO_DB_URI || "mongodb://localhost:27017/GenericApi",
  mongodbURI:
    process.env.MONGO_DB_URI ||
    "mongodb+srv://sp348770:6hoHJyPci8ryZuO9@cluster0.4zkgcih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  port: process.env.PORT || 7050,
  dynamicModels: new Array(),
};