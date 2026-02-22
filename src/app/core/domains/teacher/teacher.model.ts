export interface Teacher {
  id: number;
  name: string;
  abr: string;
}

export interface TeacherPost extends Omit<Teacher, "id"> {}

