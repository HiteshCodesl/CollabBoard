 import RoomCanvas from "@/components/RoomCanvas";

 async function RoomPage({params}:{
    params: {
      roomId: string
    }
 }){
  const roomId = params.roomId;
  return <RoomCanvas roomId={roomId} />
}

export default RoomPage;