import React, { useEffect, useState } from "react";

function Reciver() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPC] = useState<RTCPeerConnection | null>(null);
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

  return <div>Reciver</div>;
}

export default Reciver;
