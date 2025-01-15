// signaling server 
// we need to send three types of the messages
// - create offer -> send to the reciver socket
// - create answer -> send to the sender socket
// ice candidate  -> exchanges among the sender and reciver
    
import { WebSocket } from "ws";
const wss = new WebSocket.Server({port : 8080});
let  senderSocket : null | WebSocket = null;
let reciverSocket : null | WebSocket = null;
wss.on("connection" , (ws) => {
    ws.on("erro" , console.error);
    ws.on("message" , (data : any) => {
        const messages = JSON.parse(data);
        if(messages.type === 'sender'){
            senderSocket = ws;
        }
        else if(messages.types === 'reciver'){
            reciverSocket = ws;
        }else if(messages.types === 'createOffer'){
            if(ws !== senderSocket){
                return ;
            }
            reciverSocket?.send(JSON.stringify({type : "createOffer" ,sdp :messages.sdp}));
        }else if(messages.types === 'createAnswer'){
            if(ws !== reciverSocket){
                return;
            }
            senderSocket?.send(JSON.stringify({type : "createAnswer" , sdp : messages.sdp}));
        }else if(messages.type === 'iceCandidate'){
            if(ws === senderSocket){
                reciverSocket?.send(JSON.stringify({type : "iceCandidate" , candidate : messages.candidate}));
            }else if(ws === reciverSocket){
                senderSocket?.send(JSON.stringify({type : "iceCandidate" , candidate : messages.candidate}));
            }
        }
    })
})