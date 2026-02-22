export interface Group {
  id: number;
  name: string;
  type: string;
  classe: string;
  size: number;
  levelAbr: string;
  levelId: number;
}

export interface GroupPost extends Omit<Group, "id">{}
