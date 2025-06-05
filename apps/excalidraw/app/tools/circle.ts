
export function drawCirclePreview(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currX: number,
  currY: number
) {
  const radius = Math.max(currX - startX, currY - startY) / 2;
  const centerX = startX + radius;
  const centerY = startY + radius;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

export function createCircleShape(
  startX: number,
  startY: number,
  currX: number,
  currY: number
): Shape {
  const radius = Math.max(currX - startX, currY - startY) / 2;

  return {
    type: "circle",
    radius,
    centerX: startX + radius,
    centerY: startY + radius,
  };
}
