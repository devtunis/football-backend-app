import cp from "node:child_process"
import path from "node:path";
import { fileURLToPath } from "node:url";
import User from "../Models/User";
import refresh_token from "../Models/refresh_tokens";

function Producer(BrokerMessages,payload){
   
    BrokerMessages.send(payload)
}

  

const pathLine = path.join(fileURLToPath(import.meta.url),"../../BrokerMessageJob/broker.js")
const Broker = cp.fork(pathLine);

  
function ListenWorkerResult(){


 Broker.on("message",async(message)=>{
    console.log(message)

 
 })

}


ListenWorkerResult()


export  const uploadController = async(req,res) => {
    
    const {img} = req.body 
    
    Producer(Broker,{userid:req.user.id,img })
    
    return res.status(200).json({status :"Processing"})
    
 

}
 

 

