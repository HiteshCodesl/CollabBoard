
import { RoomCanvas } from "../../components/RoomCanvas";

interface CanvasPageProps {
  params: {
    roomId: string;
  };
}

export default function CanvasPage({ params }: CanvasPageProps) {
  return <RoomCanvas roomId={params.roomId} />;
}
