import { Circle, Eraser, Pen, RectangleHorizontal, Slash } from "lucide-react";
import { Icons } from "./Icons";

export function Navbar({selectedTool, setSelectedTool}: {
    selectedTool: shapeType,
    setSelectedTool: (s: shapeType) => void
}) {
   return <div className="fixed flex justify-center w-full mx-auto top-20 ">

      <div className= "flex gap-32 p-10 px-60 bg-[#18181b] rounded-3xl items-center ">

    <Icons onClick={()=>{
              setSelectedTool("pen")
      }} 
           activated = {selectedTool === "pen"}
           icon={<Pen  
           size={100} 
           strokeWidth={1} />} 
    />

    <Icons onClick={() =>{
              setSelectedTool("rect")
      }}
           activated = {selectedTool === "rect"} 
           icon={<RectangleHorizontal 
           size={100} 
           strokeWidth={1} />}
    />

    <Icons  onClick={()=>{
               setSelectedTool("circle")
              }}
            activated = {selectedTool === "circle"}
            icon={<Circle 
            size={100} 
            strokeWidth={1} />}
    />

    <Icons  onClick={()=>{
               setSelectedTool("line")
              }}
            activated = {selectedTool === "line"}
            icon={<Slash 
            size={100} 
            strokeWidth={1} />}
    />

    <Icons  onClick={()=>{
               setSelectedTool("eraser")
              }}
            activated = {selectedTool === "eraser"}
            icon={<Eraser 
            size={100} 
            strokeWidth={1} />}
    />

        </div>
    </div>
}