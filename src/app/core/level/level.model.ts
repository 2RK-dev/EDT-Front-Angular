export interface Level {
  id: number;
  name: string;
  abr: string;
}

export interface LevelPost extends Omit<Level, "id"> {}
