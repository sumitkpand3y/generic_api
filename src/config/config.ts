require('dotenv').config();


export let config = {
  serviceName: process.env.SERVICE_NAME || "API_SERVICE",
  // mongodbURI:process.env.MONGO_DB_URI || "mongodb://localhost:27017/GenericApi",
  mongodbURI:
    process.env.MONGO_DB_URI ||
    "mongodb+srv://sp348770:6hoHJyPci8ryZuO9@ac-ell8iks.mongodb.net/Form-Builder",
  port: process.env.PORT || 7050,
  dynamicModels: new Array(),
};