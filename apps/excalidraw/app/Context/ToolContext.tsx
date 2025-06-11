"use client"
import { createContext, ReactNode, useState, } from "react";

 interface ShapeContextType {
  selectedTool: shapeType;
  setSelectedTool: (shape: shapeType) => void;
 }

export const ShapeTypeContext = createContext<ShapeContextType | undefined  >(undefined)

export function ToolContext({children} :{
  children: ReactNode
}){
   const [selectedTool, setSelectedTool] = useState<shapeType>("pen");

  return <ShapeTypeContext.Provider value={{selectedTool, setSelectedTool}}>
          {children}
  </ShapeTypeContext.Provider> 
}