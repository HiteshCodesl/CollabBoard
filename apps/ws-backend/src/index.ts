import {WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket,
    userId: string,
    rooms: string[]
}
const users: User[] = [];
function checkUser(token: string): string | null {
  try{ 
    const decoded = jwt.verify(token, JWT_SECRET)
    if (typeof decoded === "string") {
        return null;
    }

    if (!decoded || !decoded.userId) {
        return null;
    }

    return decoded.userId;
}
    catch(e){
        return null;
    }
    return null;

}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return null;
    }

    users.push({
        ws,
        rooms: [],
        userId
    })

  ws.on("message", async function message(data) {

const parsedData = JSON.parse(data as unknown as string);
console.log(parsedData, "parsedData")

    if(parsedData.type === "join_room"){
        const user = users.find(x => x.ws === ws);
        user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type === "leave_room"){
        const user = users.find(x => x.ws === ws);
        if(!user){
            return;
        }  
        
        user.rooms = user?.rooms.filter(x => x === parsedData.room)
    }   

    if(parsedData.type === "chat"){
        const roomId = Number(parsedData.roomId);
        const message = parsedData.message;

        const room = await prismaClient.room.findUnique({
            where: {
                id: roomId
            },
        })

        if(!room){
           return;
        }
        const roomKey = room.slug;
        

        const res = await prismaClient.chat.create({
            data: {
               roomId,
               message,
               userId
            }
        })

          users.forEach((user) => {
            if(user.rooms.includes(roomKey)){
                user.ws.send(JSON.stringify({
                    type: "chat",
                    message: message,
                    roomId
                })) 
            }
            else{
                  console.log("error happend")  
                }
        })
    }
})
})