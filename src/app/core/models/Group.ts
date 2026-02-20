export interface GroupDTO {
  id: number;
  name: string;
  type: string;
  classe: string;
  size: number;
  levelAbr: string;
  levelId: number;
}

export interface GroupPostDTO extends Omit<GroupDTO, "id">{}
