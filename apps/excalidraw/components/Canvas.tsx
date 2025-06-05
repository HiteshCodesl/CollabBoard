import { draw } from "@/app/shape/draw"
import { useContext, useEffect, useRef } from "react"
import {ShapeTypeContext} from "../app/Context/ToolContext"
import { Navbar } from "./Navbar";

export function Canvas({  
    roomId,
    socket
}: {
    roomId: string
    socket: WebSocket
}) {
     const canvasRef = useRef<HTMLCanvasElement | null>(null);
     const {selectedTool, setSelectedTool} = useContext(ShapeTypeContext);
     const tool = useRef(selectedTool);

     useEffect(()=>{
        tool.current = selectedTool;
     }, [selectedTool])

    useEffect(() => {
    let cleanupDraw: (() => void) | undefined;

        if (canvasRef.current) {
           draw(canvasRef.current, roomId, socket, selectedTool, ()=> tool.current).then((cleanup) => {
           cleanupDraw = cleanup;
      });

    }
     return () => {
      cleanupDraw?.();
    };

    }, [selectedTool]);

    useEffect(()=>{
     const canvas = canvasRef.current;
     
     if(!canvas){
         return;
        }
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth

    canvas.style.height = `${window.innerHeight}px`;
    canvas.style.width = `${window.innerWidth}px`;
    }, [])

    return <div>
               <canvas className="w-screen h-screen"
                style={{
                
                backgroundColor: "black",
                margin: "0"
               }}
               ref={canvasRef}>
               </canvas>
               <Navbar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
           </div>
}
