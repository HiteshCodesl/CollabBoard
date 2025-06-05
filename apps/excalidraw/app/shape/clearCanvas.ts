
export function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        existingShapes.map((shape) => {
        if(shape.type === "rect") {
                ctx.strokeStyle = "white";
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
      } else if(shape.type === "line"){
                ctx.beginPath();
                ctx.moveTo(shape.x1, shape.y1);
                ctx.lineTo(shape.x2, shape.y2);
                ctx.stroke();
                ctx.closePath();
            }
        })
    }
