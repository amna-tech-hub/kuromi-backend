import express from 'express'
import { posttodo ,postgettodo, postsubtodo, getallsubtodo, postdeletesubtodo,postdeletetodo} from '../controllers/todocontroller.js'

let router=express.Router()
router.get('/gettodo/:id', postgettodo)

router.post('/addcategory',posttodo)

router.post('/getsubtodo/:categoryName', postsubtodo)

router.post('/deletesubtodo/:categoryName', postdeletesubtodo)


router.post('/deletetodo', postdeletetodo)


router.post('/subtodo', getallsubtodo)



export {router as todoRouter}