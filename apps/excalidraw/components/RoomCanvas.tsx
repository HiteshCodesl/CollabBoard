"use client"
import {Canvas} from "./Canvas"
import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react";

export default function RoomCanvas({
   roomId
}: {
   roomId: string
}) {
   const [socket, setSocket] = useState<WebSocket | null>(null);

   useEffect(() => {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
         setSocket(ws);
         const data = JSON.stringify({
            type: "join_room",         
            roomId: roomId
         })
         ws.send(data);
      }
}, [])

   if (!socket) {
      return <div>
         Connecting to server.....
      </div>
   }

   return <div>
      <Canvas roomId={roomId} socket={socket} />
   </div>
}


