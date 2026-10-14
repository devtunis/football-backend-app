import { fileURLToPath } from "node:url";
import { BufferImage } from "./util_workers/BufferImage";
import { AnalyzeImage } from "./util_workers/AnalyzeImage";


process.on("message", async (stream) => {
    try {
 

    console.log(`ID operation: ${stream.id} for worker 3 and this is the data sent by user` );
    
        if (process.connected) {
        const VectorImage  = await BufferImage(stream.stream.img)
        const anlyseAi = await  AnalyzeImage(VectorImage)
          
        process.send({
            ...stream,
            status: "Completed",
            worker: 'worker3',
            result:anlyseAi,
        
        });
        } else {
        console.log("IPC channel is closed, cannot send result");
        }
    } catch (err) {
        console.error(err);

        if (process.connected) {
        process.send({
            type: "failed",
            worker:  'worker3',
        });
        } else {
        console.log("IPC channel is closed, cannot send error");
        }
    }
    });

process.on("disconnect", () => {
    console.log("Parent disconnected from worker");
    });


    