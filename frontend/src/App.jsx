import "./App.css";
import { NavBar } from "./components/NavBar/";
import { WebCamSection } from "./components/WebCamSection";
import { OutputSection } from "./components/OutputSection";
import { useEffect, useState } from "react";

function isGetUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function downloadBufferAsFile(buffer, filename) {
  // Create a Blob from the buffer data
  const blob = new Blob([buffer], { type: "application/octet-stream" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // Specify the filename for the downloaded file

  // Append the link to the document body
  document.body.appendChild(link);

  // Trigger the download by clicking the link
  link.click();

  // Clean up by revoking the URL
  URL.revokeObjectURL(url);
}

async function sendVideoFramesToServer({ stream, videoElement }) {
  const websocket = new WebSocket("ws://localhost:8765");
  websocket.binaryType = "arraybuffer";

  const canvas = document.createElement("canvas");
  const { width, height } = stream.getTracks()[0].getSettings();
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  websocket.onopen = function () {
    console.log("connected");

    setInterval(() => {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height, {
        colorSpace: "srgb",
      });

      console.log(
        imageData.data.buffer,
        websocket.readyState === WebSocket.OPEN
      );

      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(imageData.data.buffer);
      }
    }, 100);
  };
}

async function accessWebCam({ videoElement }) {
  if (isGetUserMediaSupported()) {
    const constraints = {
      video: {
        width: { exact: 240 },
        height: { exact: 240 },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoElement) {
      videoElement.srcObject = stream;
      sendVideoFramesToServer({ stream, videoElement });
    }
  } else; // handleError - "Please allow the webcam access"
}

export const App = () => {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    accessWebCam({ videoElement });
    return () => {}; // Why empty cleanup function?
  }, [videoElement]);

  return (
    <>
      <NavBar />
      <main className="main-wrapper">
        <WebCamSection setVideoElement={setVideoElement} />
        <OutputSection />
      </main>
    </>
  );
};
