"use client"
import {Canvas} from "./Canvas"
import { WS_URL } from "@/app/config";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";

export function RoomCanvas({
   roomId
}: {
   roomId: string
}) {
   const [socket, setSocket] = useState<WebSocket | null>(null);
   
   useEffect(() => {
      const token = localStorage.getItem("token")
      const ws = new WebSocket(`${WS_URL}?token=${token}`);

      ws.onopen = () => {
         setSocket(ws);
         const data = JSON.stringify({
            type: "join_room",         
            roomId: roomId
         })
         ws.send(data);
      }
}, [roomId])

   if (!socket) {
      return <div>
      <Loading />
      </div>
   }

   return <div>
      <Canvas roomId={roomId} socket={socket} />
   </div>
}


