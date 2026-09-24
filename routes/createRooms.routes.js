import express from "express"
import {
    HandelCreatRoom,
    HandelSetAdmin , 
    HandelAddMember,
    HandeLDeleteMemberRoom , 
    HandelGetRooms,
    HandedlGetRoom , 
    HandelSeeRequests, 
    HandelVerifyRoom,
    HandelBreakNews,
    HandelGetNews,
    HandelGetMemebers,
    HandelsetBestPlayers,
    HandelgetsetBestPlayers
    } from  "../Controller/Buffer.controller.js"

const router = express.Router()

 
router.post("/create",HandelCreatRoom) //OK
router.post("/setAdmin",HandelSetAdmin)//Pending
router.post("/addMember",HandelAddMember)//OK
router.post("/deleteMember",HandeLDeleteMemberRoom)
router.get("/getrooms",HandelGetRooms) //OK
router.post("/joinRoom",HandedlGetRoom)//OK
router.post("/seeRequests",HandelSeeRequests)//OK
router.post("/verifyAndBringData",HandelVerifyRoom )//OK
router.post("/breakNews",HandelBreakNews )//OK
router.post("/getlastnews",HandelGetNews )//Pending
router.post("/getMembers",HandelGetMemebers )//Pending
router.post("/setBestPlayers",HandelsetBestPlayers)//Pending
router.post("/getsetBestPlayers",HandelgetsetBestPlayers)//Pending

 
 
 

export default  router