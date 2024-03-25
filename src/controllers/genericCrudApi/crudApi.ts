import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../../models/models";
import * as DynamicModel from "../../models/dynamicModel";
import mongoose from "mongoose";

const objectId = require("mongodb");

// Add Api

export async function addOne(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName = req.params.collectionName;
    let newRecord = req.body;
    if (!collectionName || !newRecord) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing collection name or new record data",
        data: {},
      };
      next();
      return;
    }

    for (let i = 0; i < newRecord.length; i++) {
      const element = newRecord[i];

      if (!element) {
        // Handle missing or invalid data
        continue; // Skip to the next iteration
      }

      try {
        if (!element._id) {
          // If _id is not provided, it's a new record, so add it
          let addUserResult = await DynamicModel.add(collectionName, element);
          if (addUserResult) {
            const customData = addUserResult.reduce((obj, item) => {
              obj[item.key] = item.value;
              return obj;
            }, {});

            req.apiStatus = {
              isSuccess: true,
              customMsg: "Data added successfully",
              data: customData,
            };
          } else {
            throw new Error("Failed to add data");
          }
        } else {
          // If _id is provided, update the existing record
          let updateRecordResult = await DynamicModel.updateOne(
            collectionName,
            element._id,
            element
          );
          if (updateRecordResult && updateRecordResult.nModified >= 0) {
            req.apiStatus = {
              isSuccess: true,
              customMsg: "Data updated successfully",
              data: {},
            };
          } else {
            throw new Error("Failed to update data");
          }
        }
      } catch (error) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1002], // Define your error codes if necessary
          customMsg: "An error occurred",
          data: {},
        };
      }

      next()
    }
  } catch (error) {
    console.error("Error adding/updating data:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      customMsg: "Failed to add/update data",
      data: {},
    };
    next();
    return;
  }
}
// Get All Data
export async function getAll(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  let collectionName = req.params.collectionName;

  // let { searchText, page, limit, sortBy, sortDirection } = req.query;
  // try {

  //     if (req.query.page && parseInt(req.query.page) > 1) {
  //         page = parseInt(req.query.page);
  //     }
  //     if (req.query.limit && parseInt(req.query.limit) > 0) {
  //         limit = parseInt(req.query.limit);
  //     }

  // } catch (err) {
  //     req.apiStatus = {
  //         isSuccess: false,
  //         error: ErrorCodes[1001],
  //         data: err,
  //     };
  //     next();
  //     return;
  // }

  // page = parseInt(page ? page : 1);
  // limit = parseInt(limit ? limit : 10);
  // let skip = (page - 1) * limit;
  // const options = {
  //     limit,
  //     skip,
  // };
  // let searchArray: any = [];
  // let searchObj:any = {};

  // searchObj['name'] = {
  //     $regex: searchText,
  //     $options: "i",
  //   };
  //   searchArray.push(searchObj);

  // const query = {
  //     $or:searchArray
  // }

  // let sortObj: any = {};
  // if (sortBy && sortDirection) {
  //     sortObj[sortBy] = JSON.parse(sortDirection);
  // }
  // options["sort"] = sortObj;

  try {
    if (!collectionName) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing collection name",
        data: {},
      };
      next();
      return;
    }

    // let filter = req.body && req.body.filter ? req.body.filter : {};
    let projection = req.body && req.body.projection ? req.body.projection : {};

    let getAllRecordsResults = await DynamicModel.find(
      collectionName,
      {},
      projection,
      {},
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return data;
        }
        next();
        return;
      }
    );

    let totalDocs = await DynamicModel.getTotalCountByAggregate(
      collectionName,
      getAllRecordsResults
    );

    if (getAllRecordsResults) {
      req.apiStatus = {
        isSuccess: true,
        customMsg: "Data Fetch Successfull",
        data: {
          totalCount: totalDocs,
          list: getAllRecordsResults,
        },
      };
      next();
      return;
    } else {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1004],
        customMsg: "Failed to fetch data",
        data: {},
      };
      next();
      return;
    }
  } catch (error) {
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "FAILED TO FETCH DATA",
      data: {},
    };
    next();
    return;
  }
}

// getOneData

export async function getById(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName = req.params.collectionName;
    let id = req.params.id;

    if (!collectionName && !id) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing collection name or id",
        data: {},
      };
      next();
      return;
    }

    let getOneRecordResult = await DynamicModel.findOne(
      collectionName,
      id,
      (err, data) => {
        if (err) {
          req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1001],
            customMsg: "Failed to fetch Data",
            data: {},
          };
        } else {
          return data;
        }
        next();
        return;
      }
    );
    if (getOneRecordResult) {
      req.apiStatus = {
        isSuccess: true,
        customMsg: "Data fetch successfull",
        data: getOneRecordResult,
      };
      next();
      return;
    }
  } catch (error) {
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: "FAILED TO FETCH DATA 2222",
      data: {},
    };
    next();
    return;
  }
}

// updateOne

export async function updateOne(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let collectionName = req.params.collectionName;
    let id = req.params.id;
    let updateRecord = req.body;

    if (!collectionName || !id || !updateRecord) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Missing data",
        data: {},
      };
      next();
      return;
    }

    let updateRecordResult = await DynamicModel.updateOne(
      collectionName,
      id,
      updateRecord
    );

    if (updateRecordResult.nModified >= 0) {
      req.apiStatus = {
        isSuccess: true,
        customeMsg: "Data update successfully",
        data: {},
      };
      next();
      return;
    } else {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1007],
        customMsg: "Failed to update data",
        data: {},
      };
      next();
      return;
    }
  } catch (error) {
    console.log("error", error);

    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1007],
      customMsg: "Failed to update Data",
      data: {},
    };
    next();
    return;
  }
}

//   Delete Record

export async function deleteOne(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  let collectionName = req.params.collectionName;
  let id = req.params.id;
  try {
    if (!collectionName || !id) {
      req.apiStatus = {
        isSuccss: false,
        error: ErrorCodes[1001],
        customMsg: "Missing params",
        data: {},
      };
      next();
      return;
    }

    let deleteRecordResult = await DynamicModel.deleteOne(collectionName, id);
    if (deleteRecordResult.deletedCount > 0) {
      if (deleteRecordResult) {
        req.apiStatus = {
          isSuccess: true,
          customMsg: "Data deleted successfully",
          data: {},
        };
        next();
        return;
      } else {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1005],
          customMsg: "Failed to delete data",
          data: {},
        };
        next();
        return;
      }
    } else {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1005],
        customMsg: "Failed to delete data",
        data: {},
      };
      next();
      return;
    }
  } catch (error) {
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1008],
      customMsg: "Something went wrong!",
      data: {},
    };
    next();
    return;
  }
}
