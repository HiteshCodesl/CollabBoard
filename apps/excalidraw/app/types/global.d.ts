
 type Shape = {
       type: "rect",
       x: number;
       y: number;
       width: number;
       height: number;
   } | {
       type: "circle";
       centerX: number;
       centerY: number;
       radius: number;
   } | {
       type: "pen";
       points: {
        x: number;
        y: number;
       }[] 
   } | {
        type: "line";
        x1: number;
        y1: number;
        x2: number;
        y2: number;
       }
    
type shapeType = "rect" | "circle" | "pen" | "line" | "eraser" 

