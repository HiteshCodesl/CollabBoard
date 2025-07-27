import { clearCanvas } from "../shape/clearCanvas";

export function eraseShapeAtPoint(
  x: number,
  y: number,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): string | null {

  for (let i = 0; i < existingShapes.length; i++) {
    const shape = existingShapes[i];

    if (shape.type === "rect") {
      if (
        // if mousePoint greater than x and less than rect width and greter than y and less than rect height then remove that shape 
        // rect(x:100, y:100, width:50, height:40)
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      ) {
        existingShapes.splice(i, 1);
        clearCanvas(existingShapes, canvas, ctx);
        return shape.id;
      }
    }
    if (shape.type === "circle") {
      //if mousePoint clicked at that coordinates and minus the cords by circle centerX and centerY coords their square addition  squareroot must be less than radius of a circle, then the circle will removed
      //circle(centerX:200, centerY:200, radius:30)
      const dx = x - shape.centerX;
      const dy = y - shape.centerY;
      if (Math.sqrt(dx * dx + dy * dy) <= shape.radius) {
        existingShapes.splice(i, 1);
        clearCanvas(existingShapes, canvas, ctx);
        return shape.id;
      }
    }
    if (shape.type === "line") {
      //line from (50,50) and (100,100) x and y coors are if near about <=5 px then deletes it
      const dist = pointToLineDistance(x, y, shape.startX, shape.startY, shape.endX, shape.endY);
      if (dist <= 5) {
        existingShapes.splice(i, 1);
        clearCanvas(existingShapes, canvas, ctx);
        return shape.id;
      }
    }
    if (shape.type === "pen") {
      // if the x and y is less than 5px delete the stroke
      if (shape.points.some(p => Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5)) {
        existingShapes.splice(i, 1);
        clearCanvas(existingShapes, canvas, ctx);
        return shape.id;
      }
    }
  }
  return null;
}

function pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const A = px - x1;//horizn dist start of line to mouse pt 
  const B = py - y1;//vetical dist start of line to pt
  const C = x2 - x1;// total horizontal line dist  
  const D = y2 - y1;//total vertical line dist

  const dot = A * C + B * D;//distance from mouse pt to horizontal line dist + distance from a mouse pt to vertical line dist
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;  //closest to start of the line
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;  // closest to the end of the line
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;  // somewhere between
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);  // distance from point to nearest line
}
