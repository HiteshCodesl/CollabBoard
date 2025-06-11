import { WebSocket, WebSocketServer } from "ws";
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
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (typeof decoded === "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    }
    catch (e) {
        return null;
    }
    return null;

}

wss.on("connection", function connection(ws, request) {
   const fullUrl = new URL(request.url || "http://localhost" );
   const token = fullUrl.searchParams.get("token") || "";
    if (!token) {
        return;
    }

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
        let parsedData;
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());

        } else {
            parsedData = JSON.parse(data);
        }

        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId)
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }

            user.rooms = user?.rooms.filter(x => x === parsedData.room)
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId
            const message = parsedData.message;

            await prismaClient.chat.create({
                data: {
                    roomId: Number(roomId),
                    message,
                    userId
                }
            })
            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId: Number(roomId)
                    }))
                }
            })
        }

        if (parsedData.type === "delete") {
            const { roomId, shapeId } = parsedData;
           

            const chats = await prismaClient.chat.findMany({
                where: {
                    roomId: roomId
                }
            })
            const target = chats.find(chat => {
                try {
                    const msg = JSON.parse(chat.message)
                    return msg?.shape.id  === shapeId;
                } catch {
                    console.error("failed to parse chat msg")
                    return false;
                }
            })
            if (target) {
                await prismaClient.chat.deleteMany({
                    where: {
                        id: target.id
                    }
                })
            }else {
                console.log("no recored found with such id")
            }
            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "delete",
                        shapeId: String(shapeId)
                    }))
                }
            })

        }
    })
})