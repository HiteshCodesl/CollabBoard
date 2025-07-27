
export function drawCirclePreview(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currX: number,
  currY: number
) {
 const centerX = (startX + currX) / 2;
 const centerY = (startY + currY) / 2;
 const radius = Math.abs(currX - startX) / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

export function createCircleShape(
  startX: number,
  startY: number,
  currX: number,
): Shape {
 const radius = Math.abs(currX - startX) / 2;

  return {
    id: crypto.randomUUID(),
    type: "circle",
    radius: Math.abs(radius),
    centerX:   startX + radius,
    centerY:   startY + radius,
  };
}
