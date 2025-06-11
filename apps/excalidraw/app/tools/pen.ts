
export function drawPenStroke(
  ctx: CanvasRenderingContext2D,
  penPoints: { x: number; y: number }[],
  point: { x: number; y: number }
) {
  const prev = penPoints[penPoints.length - 1];
  penPoints.push(point);

  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(point.x, point.y);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();
}

export function createPenShape(points: { x: number; y: number }[]): Shape {
  return {      
    id: crypto.randomUUID(),
    type: "pen",
    points: points,
  };
}
