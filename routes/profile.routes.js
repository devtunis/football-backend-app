import express from "express"
import { userInterfaceController } from  "../Controller/Buffer.controller.js"

const router = express.Router()


router.get("/details",userInterfaceController)




export default  router
