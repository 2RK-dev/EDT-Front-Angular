export interface RoomDTO {
  id: number;
  name: string;
  abr: string;
  capacity: number;
}

export interface RoomPostDTO extends Omit<RoomDTO, "id">{}
