import React, { useEffect, useState } from "react";

function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
    setSocket(socket);
  }, []);

  const sendVideo = async () => {
    const pc = new RTCPeerConnection();
    pc.onnegotiationneeded = async () => {
      console.log("negotiation needed");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({
          type: "createOffer",
          sdp: offer,
        })
      );
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: event.candidate,
          })
        );
      }
    };

    if (socket) {
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "createAnswer") {
          await pc.setRemoteDescription(message.sdp);
        }
        if (message.type === "iceCandidate") {
          pc.addIceCandidate(message.candidate);
        }
      };
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    pc.addTrack(stream.getVideoTracks()[0]);
  };
  return (
    <div>
      <button onClick={sendVideo}>Send the data</button>
    </div>
  );
}

export default Sender;
