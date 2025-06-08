
export function drawRectPreview(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currX: number,
  currY: number
) {
  const width = currX - startX;
  const height = currY - startY;
  ctx.strokeRect(startX, startY, width, height);
}

export function createRectShape(
  startX: number,
  startY: number,
  currX: number,
  currY: number
): Shape {
  return {
    id: crypto.randomUUID(),
    type: "rect",
    x: startX,
    y: startY,
    width: currX - startX,
    height: currY - startY,
  };
}
