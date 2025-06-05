
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
     type: "line",
     x1: x,
     y1: y,
     x2: currX,
     y2: currY,
    }
}