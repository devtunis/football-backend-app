import express from "express"
import { uploadController } from "../ControllerUpload/upload.controller.js"
 
const router = express.Router()


router.post("/video",uploadController)




export default  router
