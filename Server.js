import express, { json } from "express"
import 'dotenv/config';
import { ConnectionTodb } from "./ConnectionBd/connectionbd.js";
import { CustomDns } from "./CustomDns/CustomDns.js";
import { generateJWT } from "./Jwt/createJwt.js";
import { verifyJWT, verifyJWTComingSocket } from "./middleware/verifytoken.js";
import cors from "cors"
import User from "./Models/User.js";
import { httpStatusCodes } from "./Status/httpStatusCodes.js";
import { hashPasswordfn, HashPasword, hashToken, VerifyPassword } from "./util/HashPassword.js";
import cookieParser  from "cookie-parser"
import { createRefreshToken } from "./Jwt/createRefreshToken.js";
import refresh_token from "./Models/refresh_tokens.js";
import { v4 as uuidv4 } from 'uuid';
import { verifyTokenRefresh } from "./middleware/verifyTokenRefresh.js";
import { Server } from "socket.io";
import http from "http"
import * as cookie from "cookie"
import timeout from "connect-timeout";


import RoutesCreateRooms from "./routes/createRooms.routes.js"
import RotuesCreateMatch from "./routes/createEventsRoom.routes.js"
import RouteUseProfile   from "./routes/profile.routes.js"
import { limiter } from "./Limter/Limter.js";

const app = express()

app.use(limiter)
app.use(json(
    {
        limit:"100kb"
    }
))
app.use(cors({
  origin: ["http://localhost:5173","https://fnr2rshh-5173.uks1.devtunnels.ms/"],
  credentials: true,
}));


app.use(cookieParser())
CustomDns()
ConnectionTodb()
app.use(timeout("5s"));

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials:true
    }
    ,
    pingInterval: 5000,
    pingTimeout: 3000,

});


const onlineUsers = new Map()
const offLineUsers = new  Map()







 //Middlware
io.use((socket, next) => {
    const cookieHeader = socket?.handshake?.headers?.cookie
    if(!cookieHeader){
         return next(new Error("Missing cookies"));
    }

    const HeaderCookies = cookie?.parseCookie(cookieHeader)


    if(!HeaderCookies)  {
    return next(new Error("missing cookies"))
    }







    const verify = verifyJWTComingSocket(HeaderCookies.token)

    if(verify ==="missing token") {

        return next(new Error("invalid token"))
    }


    socket.data  = verify.user_name || null
    socket.data2  = verify|| null

    next()






});
io.on("connection",async(socket)=>{





    if(!socket.data)
    {

       socket.emit("auth_error",{
        reason: "TOKEN_EXPIRED"
       })
        return
    }























    const anyy = socket.data // here by username this anny


    if(anyy){

    console.log("connected ⚡",socket.id)

     if(!onlineUsers.has(anyy)){
             onlineUsers.set(socket.data , [])

      }


      offLineUsers.set(socket.id , anyy)
      onlineUsers.get(anyy).push({
         socktId : socket.id ,
        // img:socket.data2.img

        }

        )

      console.log(onlineUsers.size,"✅","length")

      console.log(onlineUsers,"✅","accept")








      io.emit("online",[...onlineUsers].map((item)=>({key:item[0],value:item[1]})))

    }




    socket.on("disconnect",()=>{

        const username = offLineUsers.get(socket.id);

        if(!username) return;


        const sockets = onlineUsers.get(username) || [];


        const newSockets = sockets.filter(
            id => id.socktId !== socket.id
        );


        if(newSockets.length === 0){
            onlineUsers.delete(username);
        }else{
            onlineUsers.set(username,newSockets);
        }


        offLineUsers.delete(socket.id);

          io.emit("online",[...onlineUsers].map((item)=>({key:item[0],value:item[1]})))
          console.log("disconnect:", socket.id);
          console.log(onlineUsers.size,"🌹");
          console.log(onlineUsers,"disconnect")
});
})



// refactor this
app.post("/login",async(req,res)=>{
    try{

        const {Username , password}  = req.body

        if(!Username || !password){

           return  res.status(httpStatusCodes.BAD_REQUEST).json({
                message : "no body!!"
            })

        }


        const findUser =  await User.findOne({user_name : Username })

        if(!findUser){
           return res.status(httpStatusCodes.BAD_REQUEST).json({
                  message : "username or password incorrect"
            })

        }


        const findPasswordFromTheUser = findUser.password
        const verifyPassword = await VerifyPassword(password ,findPasswordFromTheUser)



        if(verifyPassword){

             await refresh_token.findOneAndDelete({
                id  : findUser.id
             })



              // update the token

            const LoginAccesToken = generateJWT({id:findUser.id,user_name :findUser.user_name ,img:findUser.img})
            const LoginRefreshTooken = createRefreshToken({id:findUser.id,user_name :findUser.user_name ,img:findUser.img})

            const LoginEncryptTheToken = await hashToken(LoginRefreshTooken)

            const LoginRefreshToken = new  refresh_token({
                id : findUser.id,
                refresh_token_hash : LoginEncryptTheToken ,
                time : "1hs",


            })


            await LoginRefreshToken.save()


            res.cookie("token", LoginAccesToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 يوم
            });


            res.cookie("RefreshToken", LoginRefreshTooken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 يوم
                });



            return    res.status(httpStatusCodes.SUCCESS)
                .json({


                    status : "ok",


                    info :{
                        id : findUser.id ,
                        img : findUser.img ,
                        username: findUser.user_name,
                    },


                })


        }else{
            res.status(httpStatusCodes.BAD_REQUEST).json({
                message : "username or password incorrect"
            })
        }



    }catch(err){
        res.status(httpStatusCodes.BAD_REQUEST).json({
            message : err.message,

        })
    }
})
app.post("/ReinitializingToken",async(req,res)=>{
    try{

        const CookiesRefreshToken = req.cookies.RefreshToken

        if(!CookiesRefreshToken){
           return res.status(400).json({
                message :"missing id"
            })
        }



        let Hash = await hashToken(CookiesRefreshToken)


        const FindRefershToken = await refresh_token.findOne({refresh_token_hash:Hash}).select("refresh_token_hash")
           // fix to see all session


        if(!FindRefershToken){
           return res.status(httpStatusCodes.BAD_REQUEST).json({
                message :"we dont found you"
            })
        }


        const response = verifyTokenRefresh(req,CookiesRefreshToken)


        if(response.valid){

            const {id,user_name,img,password} = response.decoded
            const ReintializingAccesToken = generateJWT({id,user_name,img})

          return  res.cookie("token", ReintializingAccesToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                 maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .status(httpStatusCodes.SUCCESS).json({
                  message :`Succes Refresh acces Token mr ${req.user2.user_name} you can browse now 🎉`,
                  data : req.user2,
                  customMessage : "ok"

             })




        }
        else{
          return   res.status(httpStatusCodes.BAD_REQUEST).json({
                message : "Log-out",
                info:"refresh-token-expired"
            })
        }







    }catch(error){
        res.status(404).json({
            message : error.message
        })
    }
})
app.post("/create",async(req,res)=>{
    try{

        const {user_name , user_img,user_password} = req.body




        // insert to database

        const hashedPassword = await HashPasword(user_password);
      const uuid = uuidv4()

        const user = new User({
                id : uuid ,
                user_name: user_name,
                psuedoName:user_name.includes("_")?user_name.split("_")[0] : user_name,
                img :  user_img,
                password:hashedPassword
            })


       // -------------------------------------------------------------



       const savedUser = await user.save();
       const AccesToken = generateJWT({id:uuid,user_name  ,img:user_img})
       const RefreshTooken = createRefreshToken({id:uuid,user_name  ,img:user_img})

        const EncryptTheToken = await hashToken(RefreshTooken)

       const Refreshtokennn = new  refresh_token({
         id : uuid,
         refresh_token_hash : EncryptTheToken ,
         time : "1h"


       })


        await Refreshtokennn.save()

     // ---------------------------------------------------------------------

        res.cookie("token", AccesToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                  maxAge: 30 * 24 * 60 * 60 * 1000,
         });


       res.cookie("RefreshToken", RefreshTooken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                  maxAge: 30 * 24 * 60 * 60 * 1000,
         });



       res.status(httpStatusCodes.CREATED).json({
                user : user,
                AccesToken : AccesToken,
                RefreshToken : RefreshTooken

        });




    }catch(error){
        res.status(httpStatusCodes.CONFLICT).json({
            message : "User name Already Exist",
              //reallMessage : error.message
        });
    }
})



app.get("/getmydata",verifyJWT,async(req,res)=>{
    try{


        res.status(httpStatusCodes.SUCCESS)
        .json(req.user)

    }catch(error){
        res.status(httpStatusCodes.BAD_REQUEST).json({
            messae : error.message
        })
    }
})
app.post("/api/deleteCookies",(_, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
  });

   res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
  });
  res.sendStatus(200);
});



// Create Routers  room
app.use("/room",verifyJWT,RoutesCreateRooms)
app.use("/create",verifyJWT,RotuesCreateMatch)
app.use("/profile",verifyJWT,RouteUseProfile)

const GateWay =  process.env.PORT || 3000;
server.listen(GateWay,()=>console.log(`Server Runing at ${GateWay}`))
