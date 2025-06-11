
export function drawLinePreview(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    currX: number,
    currY: number
){
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(startX, startY);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.closePath();
}

export function createLineShape(
    x: number ,
    y: number,
    currX: number,
    currY: number,
): Shape{
    return {
     id: crypto.randomUUID(),
     type: "line",
     startX: x,
     startY: y,
     endX: currX,
     endY: currY,
    }
}