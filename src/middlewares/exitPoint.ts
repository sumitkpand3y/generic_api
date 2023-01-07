import { Response } from "express";
import * as logger from "../models/logs";
import { ResponseObj } from "../models/models";


/**
 *
 * @param req
 * @param res
 */
export function exitPoint(req: any, res: Response | any) {

  // console.log("l13 ", req.apiStatus);
  
  if (req.apiStatus.isSuccess) {
    // console.log(req.apiStatus.data);
    let responseObj = new ResponseObj(200, "Success", req.apiStatus.data);
    if(req.apiStatus.customMsg){

      responseObj.message = req.apiStatus.customMsg
    }
    
    res.status(responseObj.status).json(responseObj);
  } else {
    let responseObj = new ResponseObj(
      req.apiStatus.error.statusCode,
      req.apiStatus.error.message,
      req.apiStatus.data
    );
    if(req.apiStatus.customMsg){
      responseObj['message'] = req.apiStatus.customMsg
    }
    res.status(responseObj.status).json(responseObj);
  }
}