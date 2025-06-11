import express, {Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { SignupSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"
import { middleware } from "./middleware.js";
import { prismaClient } from "@repo/db/client"
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.data)
        res.json({
            message: "unauthorized"
        })
        return;
    }
    try {
       const user = await prismaClient.user.create({
            data: {
                username: parsedData.data?.username,
                password: parsedData.data?.password,
                name: parsedData.data?.name
            }
        })
  if (user){
            const token = jwt.sign({
                userId: user?.id
            }, JWT_SECRET)

            res.json({
                token
            })
    }
 } catch (e) {
        res.status(411).json({
            message: "User already exists "
        })
    }
})

app.post("/signin", async(req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);

    if (!parsedData) {
        res.json({
            message: "unauthorized"
        })
        return;
    }
    const user = await prismaClient.user.findFirst({   
        where: {
            username: parsedData.data?.username,
            password: parsedData.data?.password
        }
    })

    try {
        if (user) {
            const userId = 1
            const token = jwt.sign({
                userId: user?.id
            }, JWT_SECRET)

            res.json({
                token
            })
        }
    } catch (e) {
        console.log(e)
    }

})

app.post("/room", middleware, async(req:Request , res:Response) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData) {
        res.json({
            message: "unauthorized"
        })
        return;
    }
    //@ts-ignore
    const userId =  req.userId;

    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data?.name || "",
            adminId: userId
        }
    })

    res.json({
        roomId: room.id
    })
})

app.get("/chats/:roomId", async(req, res)=>{
    try{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: Number(roomId)
        },
        orderBy: {
            id: "desc"
        },
        take: 1000
    })
    res.json({
        messages
    })
} catch(e){
    console.log(e);
}
})

app.get("/room/:slug", async(req, res)=>{
    try{
        const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug: slug
        }
    })
    res.json({
       roomId: room?.id
    })
}catch(e){
    console.log(e)
}
})

app.post("/room/id", async(req, res)=>{
    try{
     const {id} = req.body;

      const room = await prismaClient.room.findUnique({
        where:{
             id: Number(id)
        }
      })
      if(room){
          res.json({roomId: room?.id})
    }else{
     res.status(400).json({message: "invalid roomId"})
    }
}
    catch(e){
        console.log(e)
    }
})

app.listen(3002);