  
import cp from "node:child_process"
import { fileURLToPath } from "node:url";
import path from "node:path";
import {uuid} from "../BrokerMessageJob/uuid.js"
 
 
import fs from 'node:fs';
import { generateTemplateCode } from "./content.js";
import { fail } from "node:assert";
 


 
let GlobalWorkerFile = 'workers'
let NumberOfWorker = 5

let workerManger  = []
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 

const  createWorkerManger = ()=>{
		for(let i = 1;i<=5;i++){
		let createWorker = {
				worker:`worker${i}`,
				available:i==1?true:true,
				refWorker:cp.fork(path.join(__dirname,`../${GlobalWorkerFile}/worker${i}.js`)),
				stauts:"good"
		}
		workerManger.push(createWorker)
		}
		 
}
const createfiles = (pathFile,count)=>{
 
       if(count<1)return
	 
		try {
		fs.writeFileSync(`${pathFile}/worker${count}.js`, generateTemplateCode(count));
		// file written successfully
		} catch (err) {
		console.error(err);
		}
		createfiles(pathFile,count-1)
}


const runModule = async () => {
  try {
    const projectFolder = new URL(`../${GlobalWorkerFile}`, import.meta.url);

   
    
	 


	try {
	if (!fs.existsSync(projectFolder)) {
		fs.mkdirSync(projectFolder);
		console.log("Create success")
		
	}
	} catch (err) {
	console.error(err);
	}



	createfiles(path.join(__dirname,`../${GlobalWorkerFile}`),NumberOfWorker)
 
	
	createWorkerManger()
 

  } catch (err) {
    console.error(err);
  }
};


runModule()





 
 
 

  


 
  
 
let SleepWorkes = [] 
let waiters = [] 
let PendingJob = []

let Register = new Map()

let attempts = new Map()

 


// function listenWorkers(workerManager) { refactor structure
//     for (const worker of workerManager) {
//         attempts.set(worker.worker, 0);

//         worker.refWorker.on("message", (result) => {
//             handleWorkerMessage(result, workerManager);
//         });

//         worker.refWorker.on("exit", (code, signal) => {
//             handleWorkerExit(worker, code, signal);
//         });
//     }
// }


function listenWorkes(workerManger){
	 
	workerManger.forEach((worker)=>{ 
	   
	    attempts.set(worker.worker,0)
		 
		worker.refWorker.on('message', async(result) => {
          
		   console.log("-------------------------------------------------------")
		   //console.log(result,"result wroker")
		   if(result.status=="Completed"){
			Register.delete(result.worker)
			process.send(result)
		   }

		   
		  
		   console.log("-------------------------------------------------------")
		  



               const MakeWorkerAlive =  workerManger.find(item => item.worker === result.worker && item.stauts ==="good")
			   
                MakeWorkerAlive.available = true
       

			const getAliveWorker = getAvailableWorker(workerManger)
	
			if(PendingJob.length>0 && getAliveWorker){

		     	
			    console.log("Their Pending Job",PendingJob.length)
				const TakeJob = PendingJob.shift()
			    getAliveWorker.refWorker.send(TakeJob)
				getAliveWorker.available = false

				Register.set(getAliveWorker.worker,TakeJob)
			  
			} 
	
	
		})

		 worker.refWorker.on("exit", (code, signal) => {
			console.log("Worker ------------------------------- died", { code, signal });

			if (code !== 0) {
				// Worker failed
			 
				 
				
			     
                 worker.stauts = "died"
				 worker.available = false
		 
				 console.log("this what reset 114",PendingJob.length)
				  if(Register.get(worker.worker)){
                     SetJob(Register.get(worker.worker))
					   
				  }

				 ReviveWroker(worker.worker)
  

				
			}
		});

 

	})
 
}
 

function listenWorker (w){
		// shoule be ahnde the pid of child
		w.refWorker.on("message",(foo)=>
		{
			console.log(foo,"result ..............REVIER......................")
			if(foo.status=="Completed")
			{
				Register.delete(w.worker)
				w.available = true
			}

			 
				
				if(PendingJob.length>0 && w.available){

					console.log("Their Pending Job",PendingJob.length)
					let TakJob = PendingJob.shift() 
					w.refWorker.send(TakJob)
					w.available = false

					Register.set(w.worker, TakJob)
				
				} 
		
		})
		w.refWorker.on("exit", (code, signal) => {
			if (code !== 0) {
				console.log("exist ------------------------------------- again")
 
					
					
					w.stauts = "died" 
					w.available = false
					console.log("this is what reset from 168",PendingJob.length)
					 
					if(Register.get(w.worker)){
						SetJob(Register.get(w.worker))
						
					}

		        	ReviveWroker(w.worker)
		
			}
			
		})
	}





function ReviveWroker(nameworker){
	console.log("this the nameWorer",nameworker)
 


	if(attempts.get(nameworker)>=10)
	{
		console.log("you reach it ")
		return
	} 
	else{
		attempts.set(nameworker,attempts.get(nameworker)+1)
 
	    const RestartWroker = workerManger.find(item => item.worker === nameworker)
		RestartWroker.refWorker = cp.fork(path.join(__dirname,`../${GlobalWorkerFile}/${nameworker}.js`)) // start from here solve this bugg hhah solve it dont worry
		RestartWroker.stauts = "good"
		RestartWroker.available = true
		listenWorker(RestartWroker)

	}
 


	 
}
function getAvailableWorker(workerManger){
	return workerManger.find(worker=>worker.available && worker.stauts==="good")
}
 



listenWorkes(workerManger)
 
 
 






 
const WaitWorker  = ()=>{
	
		return new Promise((resolve,reject)=>{
			    
			   if(waiters.length>0){
				resolve(waiters.shift())
			   }
				 
				else{
			
					SleepWorkes.push({resolve,reject})
				 
			    } 
		})
}
function SetJob(job){
	     
		 if(SleepWorkes.length>0){
			SleepWorkes.shift().resolve(job)
		 }
		 else{
			waiters.push(job)
			
		 }
		 
		 
	 
 
 
	 
	 
}
async function runQuee(){
		
	 while(true){
		
		 const foo  = await WaitWorker()
		 // HandelRequests(...)
		 

		 const ValidWroker = getAvailableWorker(workerManger)
	 
		 if(ValidWroker){	
		     
			Register.set(ValidWroker.worker ,foo)
            ValidWroker.refWorker.send(foo)
		    ValidWroker.available = false
			 
		 }else{
               PendingJob.push(foo)
			   console.log("......queued......")
			   
		 }
	 
	 }
 }


runQuee()
 

 
process.on('message', async (stream) => {SetJob({id:uuid(),stream})})
 

 
 
 