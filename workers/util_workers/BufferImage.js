import { spawn } from "node:child_process";

export const BufferImage = (img) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    // old version
    const ffmpeg = spawn("ffmpeg", [
      "-i", img,

      "-vf",
      "select='not(mod(n\\,10))',scale=160:-1,tile=5x3",

      "-frames:v", "1",
      "-f", "image2",
      "-vcodec", "mjpeg",

      // Lower JPEG quality = smaller/faster output
      "-q:v", "8",

      "pipe:1"
    ]);


 



    ffmpeg.stdout.on("data", chunk => {
      chunks.push(chunk);
    });

    ffmpeg.on("close", code => {
      if (code !== 0) {
        reject(new Error("FFmpeg failed"));
        return;
      }

      resolve(Buffer.concat(chunks));
    });

    ffmpeg.on("error", reject);
  });
};