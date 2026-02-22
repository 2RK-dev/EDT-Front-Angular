export interface Subject {
  id: number;
  name: string;
  abr: string;
  associatedLevel: number | null;
}

export interface SubjectPost extends Omit<Subject, "id"> {}
