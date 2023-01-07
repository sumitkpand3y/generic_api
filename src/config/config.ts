require('dotenv').config();


export let config ={
    serviceName: process.env.SERVICE_NAME || "API_SERVICE",
    mongodbURI:process.env.MONGO_DB_URI || "mongodb://localhost:27017/GenericApi",
    port:process.env.PORT || 7050,
    dynamicModels:new Array(),
}