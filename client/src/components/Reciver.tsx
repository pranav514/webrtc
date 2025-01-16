import React, { useEffect, useState } from "react";

function Reciver() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPC] = useState<RTCPeerConnection | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    // setSocket(socket)
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "reciver",
        })
      );
    };
    socket.onmessage = async (event: any) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        const pc = new RTCPeerConnection();
        setPC(pc);
        pc.setRemoteDescription(message.sdp);
        pc.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = new MediaStream([event.track]);
          }
        };
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        pc.onicecandidate = (event) => {
          socket.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: event.candidate,
            })
          );
        };

        socket.send(
          JSON.stringify({
            type: "createAnswer",
            sdp: answer,
          })
        );
      }
      if (message.type === "iceCandidate") {
        if (pc) {
          pc.addIceCandidate(message.candidate);
        }
      }
    };
    setSocket(socket);
  }, []);

  return (
    <div>
      <video ref={videoRef}></video>
    </div>
  );
}

export default Reciver;
