  
import cp from "node:child_process"
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const worker1 = cp.fork(path.join(__dirname,"../Workers/worker1.js"));
const worker2 = cp.fork(path.join(__dirname,"../Workers/worker2.js"));
const worker3 = cp.fork(path.join(__dirname,"../Workers/worker3.js"));
const worker4 = cp.fork(path.join(__dirname,"../Workers/worker4.js"));
const worker5 = cp.fork(path.join(__dirname,"../Workers/worker5.js"));

 
let workerManger =  [
  {
    worker:"worker1",
    available:true,
    refWorker:worker1,
	stauts:"good"
  },
  {
    worker:"worker2",
    available:true,
    refWorker:worker2,
	stauts:"good"
  },
  {
     worker:"worker3",
     available:true,
     refWorker:worker3,
	 stauts:"good"
  },
   {
     worker:"worker4",
     available:true,
     refWorker:worker4,
	 stauts:"good"
  }, {
     worker:"worker5",
     available:true,
     refWorker:worker5,
	 stauts:"good"
  },
]



  
 
let SleepWorkes = [] 
let waiters = [] 
 

let PendingJobsForTheQuee = []

// do like map save the all opeartion happend cauz it fall return working 


function listenWorkes(workerManger){
	
	workerManger.forEach((worker)=>{

		worker.refWorker.on('message', async(message) => {
		   console.log(message)
			const MakeWorkerAlive =  workerManger.find(item => item.worker === message.worker)
			MakeWorkerAlive.available = true

			const goodWroker = getAvailableWorker(workerManger)
			 
			if(PendingJobsForTheQuee.length>0){
				const TakeJob = PendingJobsForTheQuee.shift()
			    goodWroker.refWorker.send(TakeJob.img)
				goodWroker.available = false

			}
	
	
		})

		// retry connection
		worker.refWorker.on('close', (code) => {
		console.log(`Child process exited with code ${code}`);
	 
		});

		worker.refWorker.on("exit", (code, signal) => {
			console.log(
				`Worker ${worker.worker} exited`,
				{ code, signal }
			);

	
 
 
    });

	 
		worker.refWorker.on("error", (err) => {
		console.error(
			`Worker ${worker.worker} error:`,
			err
		);
		});

   
		worker.refWorker.on("disconnect", () => {
		console.log(`Worker ${worker.worker} disconnected`);

	
		});


	})

}
function getAvailableWorker(workerManger){
	return workerManger.find(worker=>worker.available && worker.stauts==="good")
}
 

listenWorkes(workerManger)

 


// refactor this code
// mourad tahrri







//waiters
const WaitWorker  = ()=>{
	
		return new Promise((resolve,reject)=>{
			    
			   if(waiters.length>0){
				resolve(waiters.shift())
			   }
				 
				else{
			    SleepWorkes.push({
						resolve,reject
				})
				 
		 
				
			} 
		})
}
function Consumer(writer){
	     
		 if(SleepWorkes.length>0){
			SleepWorkes.shift().resolve(writer)
		 }
		 else{
			waiters.push(writer)
			
		 }




	 
}
async function runQuee(){
		
	 while(true){
		
		 const foo  = await WaitWorker()
		 console.log(foo.img)
		 foo.worker.send(foo.img)
			
	 
	 }
 }


runQuee()
 

 
process.on('message', async (message) => {
	const worker = getAvailableWorker(workerManger)
     
	console.log({...worker,refWorker:"..."})
     if(!worker){
		console.log("queued")
        PendingJobsForTheQuee.push({id:message.id,type:message.typeJob,img:message.img_link})
		return 
	 }
 
	
	Consumer({
		id:message.id,
		type:message.typeJob,
		img:message.img_link,
		worker:worker.refWorker
	})
 
	worker.available =false
})
 
 
 
 
 
 