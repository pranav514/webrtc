import React, { useEffect, useState } from 'react'


function Sender() {
  const [socket  , setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws//localhost:8080");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type : 'sender'
      }))
    }
  })

  const sendVideo = async () => {
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription();
    socket?.send(JSON.stringify({
      type : 'createOffer',
      sdp : offer
    }))
    if(socket){
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if(message.type === 'createAnswer'){
          await pc.setRemoteDescription(message.sdp)
        }
      }
    }

  }
  return (
    <div>
      <button onClick = {sendVideo}>Send the data</button>
    </div>
  )
}

export default Sender