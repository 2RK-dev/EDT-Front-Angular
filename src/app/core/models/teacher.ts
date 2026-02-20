export interface TeacherDTO {
  id: number;
  name: string;
  abr: string;
}

export interface TeacherPostDTO extends Omit<TeacherDTO, "id"> {}

