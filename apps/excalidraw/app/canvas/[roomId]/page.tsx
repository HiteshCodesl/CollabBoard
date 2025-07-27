
import { RoomCanvas } from "../../components/RoomCanvas";

interface CanvasPageProps {
  params: {
    roomId: string;
  };
}

export default async function CanvasPage({ params }: CanvasPageProps) {
  return <RoomCanvas roomId={ params.roomId} />;
}
