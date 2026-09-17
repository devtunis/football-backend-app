import express from "express"

import {

    CreateFinshedMatchController
     ,createMatchcontroller,
     GetUsersForCustomDeck,
     setDeckForMatches
    } from "../Controller/Buffer.controller.js"


const router = express.Router()


router.post("/match",createMatchcontroller)
router.post("/Finished",CreateFinshedMatchController)
router.post("/match/setdeck",setDeckForMatches)
router.post("/match/getUsersCustomDeck",GetUsersForCustomDeck)


export default router
