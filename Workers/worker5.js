import { fileURLToPath } from "node:url";
import { AnalyzeImage } from "./util_workers/AnalyzeImage";
import { BufferImage } from "./util_workers/BufferImage";
import { exit } from "node:process";
 
process.on("message", async (stream) => {
  try {
 

 console.log(stream)

    if (process.connected) {
      process.send({
        
        status: "Completed",
        worker: "worker5",
      });
    } else {
      console.log("IPC channel is closed, cannot send result");
    }
  } catch (err) {
    console.error(err);

    if (process.connected) {
      process.send({
        type: "failed",
        worker: "worker5",
      });
    } else {
      console.log("IPC channel is closed, cannot send error");
    }
  }
});

process.on("disconnect", () => {
  console.log("Parent disconnected from worker");
});
