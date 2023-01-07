import {Request,Response,NextFunction} from 'express'
import * as logger from "../models/logs";

export function entryPoint(req:Request,res:Response,next:NextFunction){
    // req.txId = generateTransactionId();
 
    // logger.logModule.ROUTE,
    // "entryPoint("+
    // "):" +
    // req.url + 
    // (req.body ? ", payload:present" : "")
    
    next();
}



