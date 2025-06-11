import RoomCanvas from "@/components/RoomCanvas";

type PageProps = {
  params: {
    roomId: string;
  };
};

export default function RoomPage({ params }: PageProps) {
  return <RoomCanvas roomId={params.roomId} />;
}
