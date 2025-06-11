
export function clearCanvas(existingShapes: Shape[] | undefined, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        existingShapes?.forEach((shape) => {
        ctx.strokeStyle = "white";

        if(shape.type === "rect") {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

      } else if (shape.type === "circle") {
                ctx.beginPath();
                ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
                ctx.stroke();
                ctx.closePath();
                
      } else if(shape.type === "pen"){
                ctx.beginPath();
                shape.points.forEach((to, i) => {
                if (i === 0) return;
                const from = shape.points[i - 1];
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
            })
                ctx.stroke();
                ctx.closePath();
      } else if(shape.type === "line"){
                ctx.beginPath();
                ctx.moveTo(shape.startX, shape.startY);
                ctx.lineTo(shape.endX, shape.endY);
                ctx.stroke();
                ctx.closePath();
            }
        })
    }
