export interface Room {
  id: number;
  name: string;
  abr: string;
  capacity: number;
}

export interface RoomPost extends Omit<Room, "id">{}
