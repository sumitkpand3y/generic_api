import { NextFunction, response } from "express";

import mongoose = require("mongoose")

import { getCollectionObject } from "../seed/getModels";

const Schema = mongoose.Schema;

export let schema = new Schema({}, {strict:false,versionKey:false});



export var add = (
    collectionName:string,
    data:any
):any=>{
    let startTime:any = new Date();
    if(data && !data.length){
        data = data
    }
    return getCollectionObject(collectionName, schema).insertMany(data)
}



// Get All Data

export let find = (collectionName:string,query:any,projections:any,options:any,cb:Function)=>{
    let startTime:any = new Date();
    return getCollectionObject(collectionName, schema).find(query, projections,options, (err, data)=>{
        cb(err, data)
    })
}
export var getTotalCountByAggregate = function (collectionName, array: any) {
    return getCollectionObject(collectionName, schema).countDocuments([
      array,
    //   { $count: "total_count" },
    ]);
  };


//find one
export var findOne = (
    collectionName:string,
    id:string,
    callBack:Function
)=>{
    // let startTime:any = new Date();
    return getCollectionObject(collectionName,schema).findById(id,function(err,data){
        // let responseTime = new Date().getTime() - startTime.getTime();
        callBack(err,data)
    })
}

// //updateOne
export var updateOne = (
    collectionName:string,
    id: string,
    data:JSON,
):any =>{
    let startTime:any = new Date();
    return getCollectionObject(collectionName,schema).updateOne(
        {_id: id},
        {$set:data},
        {upsert:false},
    )
}

// //deleteOne
export var deleteOne = (
    collectionName:string,
    id:string,
)=>{
    let startTime:any = new Date();
    return getCollectionObject(collectionName,schema).deleteOne(
        {_id:id},
    )
}
