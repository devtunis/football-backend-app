import express from "express"

import {

    CreateFinshedMatchController
     ,createMatchcontroller,
     GetUsersForCustomDeck,
     setDeckForMatches,
     getMapPlayer,
     HandelJoinSession
    } from "../Controller/Buffer.controller.js"


const router = express.Router()


router.post("/match",createMatchcontroller)
router.post("/Finished",CreateFinshedMatchController)
router.post("/match/setdeck",setDeckForMatches)
router.post("/match/getUsersCustomDeck",GetUsersForCustomDeck)
router.post("/match/getMapPlayer",getMapPlayer)
router.post("/match/joinSession",HandelJoinSession)


export default router

//git --no-pager branch