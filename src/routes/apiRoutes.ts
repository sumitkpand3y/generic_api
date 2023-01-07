import express from "express";
import * as UserCollection from "../controllers/genericCrudApi/crudApi"
import { entryPoint } from "../middlewares/entryPoint";
import { exitPoint } from "../middlewares/exitPoint";

let router = express.Router();

router.post('/addOne/:collectionName',
    entryPoint,
    UserCollection.addOne,
    exitPoint
)

router.post('/getAll/:collectionName',
    entryPoint,
    UserCollection.getAll,
    exitPoint
)

router.get('/getOne/:collectionName/:id',
    entryPoint,
    UserCollection.getById,
    exitPoint
)

router.put('/updateOne/:collectionName/:id',
    entryPoint,
    UserCollection.updateOne,
    exitPoint
)

router.delete('/deleteOne/:collectionName/:id',
    entryPoint,
    UserCollection.deleteOne,
    exitPoint
)


module.exports = router;