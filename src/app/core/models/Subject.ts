export interface SubjectDTO {
  id: number;
  name: string;
  abr: string;
  associatedLevel: number | null;
}

export interface SubjectPostDTO extends Omit<SubjectDTO, "id"> {}
