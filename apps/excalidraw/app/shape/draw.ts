import { getExistingShapes } from "./http";
import { clearCanvas } from "./clearCanvas";
import { createRectShape, drawRectPreview, } from "../tools/rect";
import { createCircleShape, drawCirclePreview } from "../tools/circle";
import { createPenShape, drawPenStroke } from "../tools/pen";
import { drawLinePreview, createLineShape} from "../tools/line";
import { eraseShapeAtPoint } from "../tools/eraser";

export async function draw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    selectedTool: shapeType,
    getTool: () => shapeType): Promise<() => void> {
    
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return () => {};
    }

    let existingShapes: Shape[]= await getExistingShapes(roomId);
    let penPoints: { x: number, y: number }[] = [];

    let clicked = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e: MouseEvent) => {
        clicked = true;
        startX = e.offsetX;
        startY = e.offsetY;

        const tool = getTool();
        if (tool === "pen") {
            penPoints = [{ x: e.offsetX, y: e.offsetY }];
        }
    }

    const onMouseUp = (e: MouseEvent) => {
        
        clicked = false;
        const currX = e.offsetX;
        const currY = e.offsetY;

         eraseShapeAtPoint(currX, currY,existingShapes,  canvas, ctx);

        let shape: Shape | null = null;
        const tool = getTool();

        if (tool === "rect") {
            shape = createRectShape(startX, startY, currX, currY)
        }
        else if (tool === "circle") {
            shape = createCircleShape(startX, startY, currX, currY)
        }
        else if (tool === "pen") {
            shape = createPenShape(penPoints);
        }
        else if (tool === "line"){
            shape = createLineShape(startX, startY, currX, currY)
        }
        
        if (!shape) { return };
        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape,
            }),
            roomId,
        }))
        clearCanvas(existingShapes, canvas, ctx)
    }

    const onMouseMove = (e: MouseEvent) =>{
        const rect = canvas.getBoundingClientRect();
        if (clicked) {
            const currX = (e.offsetX - rect.left)*(canvas.width / rect.width);
            const currY = (e.offsetY - rect.top)*(canvas.height / rect.height); 

            ctx.strokeStyle = "rgba(255, 255, 255)"
            const tool = getTool();

         if (tool !== "pen") {
             clearCanvas(existingShapes, canvas, ctx);
        }

            if (tool === "rect") {
                drawRectPreview(ctx, startX, startY, currX, currY)
            }
            else if (tool === "circle") {
                drawCirclePreview(ctx, startX, startY, currX, currY)
            }
            else if (tool === "pen") {
                drawPenStroke(ctx, penPoints, { x: currX, y: currY })
            }
            else if (tool === "line"){
                drawLinePreview(ctx, startX, startY, currX, currY)
            }
            else if (tool === "eraser"){ 
           const erasedShapeId = eraseShapeAtPoint(currX, currY,existingShapes, canvas, ctx);
           if(erasedShapeId){
                socket.send(JSON.stringify({
                    type: "delete",
                    roomId: Number(roomId),
                    shapeId: erasedShapeId
                }))
               }
               clearCanvas(existingShapes, canvas, ctx)
            }
    }
}
    const onMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);

        if(message.type === "chat"){
        const parsedShape = JSON.parse(message.message);
        existingShapes.push(parsedShape.shape);
        clearCanvas(existingShapes, canvas, ctx)

        }
        if(message.type === "delete"){
        existingShapes = existingShapes.filter(shape => shape.id !== message.shapeId);
        clearCanvas(existingShapes, canvas, ctx)

    }
}
clearCanvas(existingShapes, canvas, ctx)

    canvas.addEventListener("mousedown", onMouseDown)

    canvas.addEventListener("mouseup", onMouseUp)

    canvas.addEventListener("mousemove", (onMouseMove))
    
    socket.addEventListener("message", onMessage)

    return () => {
        canvas.removeEventListener("mousedown", onMouseDown)

        canvas.removeEventListener("mouseup", onMouseUp)

        canvas.removeEventListener("mousemove", onMouseMove)

        socket.removeEventListener("message", onMessage)
    }
}