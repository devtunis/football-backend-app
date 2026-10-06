import { fileURLToPath } from "node:url";
import { AnalyzeImage } from "./util_workers/AnalyzeImage";
import { BufferImage } from "./util_workers/BufferImage";
import { exit } from "node:process";
 
process.on("message", async (stream) => {
  try {
 
 
    console.log(`ID opeartion w1 ${stream.id} and this is the data send it by user ${stream.stream.userid} `)
     function Delay(){
      return new Promise((resolve)=>{
        setTimeout(() => {
          resolve("hey")          
        }, 5000);
      })
     }
    await Delay()


    if (process.connected) {
      process.send({
        ...stream,
        status: "Completed",
        worker: "worker1",
      });
    } else {
      console.log("IPC channel is closed, cannot send result");
    }
  } catch (err) {
    console.error(err);

    if (process.connected) {
      process.send({
        type: "failed",
        worker: "worker1",
      });
    } else {
      console.log("IPC channel is closed, cannot send error");
    }
  }
});

process.on("disconnect", () => {
  console.log("Parent disconnected from worker");
});
