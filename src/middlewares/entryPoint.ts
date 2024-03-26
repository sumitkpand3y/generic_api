import {Request,Response,NextFunction} from 'express'
import * as logger from "../models/logs";

export function entryPoint(req:Request,res:Response,next:NextFunction){
    next();
}



