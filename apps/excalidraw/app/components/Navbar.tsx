import { Circle, Eraser, Pen, RectangleHorizontal, Slash } from "lucide-react";
import { Icons } from "./Icons";

export function Navbar({selectedTool, setSelectedTool}: {
    selectedTool: shapeType,
    setSelectedTool: (s: shapeType) => void
}) {
   return <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-2xl px-4 flex items-center justify-center gap-4 z-50  flex-wrap sm:flex-nowrap max-w-[90%]">

      <div className= "flex gap-10 p-3 px-24 bg-[#18181b] rounded-xl  items-center mx-auto justify-center">

    <Icons onClick={()=>{
              setSelectedTool("pen")
      }} 
           activated = {selectedTool === "pen"}
           icon={<Pen  
           size={24} 
           strokeWidth={1} />} 
    />

    <Icons onClick={() =>{
              setSelectedTool("rect")
      }}
           activated = {selectedTool === "rect"} 
           icon={<RectangleHorizontal 
           size={24} 
           strokeWidth={1} />}
    />

    <Icons  onClick={()=>{
               setSelectedTool("circle")
              }}
            activated = {selectedTool === "circle"}
            icon={<Circle 
            size={24} 
            strokeWidth={1} />}
    />

    <Icons  onClick={()=>{
               setSelectedTool("line")
              }}
            activated = {selectedTool === "line"}
            icon={<Slash 
            size={24} 
            strokeWidth={1} />}
    />

    <Icons  onClick={()=>{
               setSelectedTool("eraser")
              }}
            activated = {selectedTool === "eraser"}
            icon={<Eraser 
            size={24} 
            strokeWidth={1} />}
    />

        </div>
    </div>
}