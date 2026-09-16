import express from "express"

import {

    CreateFinshedMatchController
     ,createMatchcontroller,
     setDeckForMatches
    } from "../Controller/Buffer.controller.js"


const router = express.Router()


router.post("/match",createMatchcontroller)
router.post("/Finished",CreateFinshedMatchController)
router.post("/match/setdeck",setDeckForMatches)


export default router
