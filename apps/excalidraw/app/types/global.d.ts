

 type Shape = {
       id: string,
       type: "rect",
       x: number;
       y: number;
       width: number;
       height: number;
   } | {
       id: string,
       type: "circle";
       centerX: number;
       centerY: number;
       radius: number;
   } | {
        id: string,
        type: "pen";
        points: {
        x: number;
        y: number;
       }[] 
   } | {
        id: string
        type: "line";
        startX: number;
        startY: number;
        endX: number;
        endY: number;
    } | {
        id: string,
        type: "eraser";
        size: number
    }
    
type shapeType = "rect" | "circle" | "pen" | "line" | "eraser" 

