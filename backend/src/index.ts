// signaling server
// we need to send three type of the messages
// - create offer -> send to the reciver socket
// - create answer -> send to the sender socket
// ice candidate  -> exchanges among the sender and reciver

import { WebSocket } from 'ws';
let senderSocket: WebSocket | null = null;
let reciverSocket: WebSocket | null = null;

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", (data: any) => {
    const messages = JSON.parse(data);
    if (messages.type === "sender") {
      senderSocket = ws;
    } else if (messages.type === "reciver") {
      reciverSocket = ws;
    } else if (messages.type === "createOffer") {
      if (ws !== senderSocket) {
        return;
      }
      reciverSocket?.send(
        JSON.stringify({ type: "createOffer", sdp: messages.sdp })
      );
    } else if (messages.type === "createAnswer") {
      if (ws !== reciverSocket) {
        return;
      }
      senderSocket?.send(
        JSON.stringify({ type: "createAnswer", sdp: messages.sdp })
      );
    } else if (messages.type === "iceCandidate") {
      if (ws === senderSocket) {
        reciverSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: messages.candidate,
          })
        );
      } else if (ws === reciverSocket) {
        senderSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: messages.candidate,
          })
        );
      }
    }
  });
});
