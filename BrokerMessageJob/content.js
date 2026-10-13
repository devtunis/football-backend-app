 


      //     setTimeout(() => {
        //         process.exit(1)
            
        // }, 3000);


        //     function Delay(){
        //     return new Promise((resolve)=>{
        //         setTimeout(() => {
        //         resolve("hey")          
        //         },5000);
        //     })
        //     }

export const  generateTemplateCode = function (NumberWorker){
    return  `import { fileURLToPath } from "node:url";
   
process.on("message", async (stream) => {
    try {
 

    console.log(\`ID operation: \${stream.id} for worker ${NumberWorker} and this is the data sent by user\` );
    
        if (process.connected) {
        process.send({
            ...stream,
            status: "Completed",
            worker: 'worker${NumberWorker}',
        });
        } else {
        console.log("IPC channel is closed, cannot send result");
        }
    } catch (err) {
        console.error(err);

        if (process.connected) {
        process.send({
            type: "failed",
            worker:  'worker${NumberWorker}',
        });
        } else {
        console.log("IPC channel is closed, cannot send error");
        }
    }
    });

process.on("disconnect", () => {
    console.log("Parent disconnected from worker");
    });


    `
       

}