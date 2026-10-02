import { AnalyzeImage } from "./util_workers/AnalyzeImage";
import { BufferImage } from "./util_workers/BufferImage";

process.on("message", async (IMG) => {
  try {
    const shrinkImage = await BufferImage(IMG);
    

    const type = await AnalyzeImage(shrinkImage);

    

    if (process.connected) {
      process.send({
        type,
        status: "Completed",
        worker: "worker4",
      });
    } else {
      console.log("IPC channel is closed, cannot send result");
    }
  } catch (err) {
    console.error(err);

    if (process.connected) {
      process.send({
        type: "failed",
        worker: "worker4",
      });
    } else {
      console.log("IPC channel is closed, cannot send error");
    }
  }
});

process.on("disconnect", () => {
  console.log("Parent disconnected from worker");
});
