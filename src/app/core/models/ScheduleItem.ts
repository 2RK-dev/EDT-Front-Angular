import {TeacherDTO} from './teacher';
import {SubjectDTO} from './Subject';
import {RoomDTO} from './Room';
import {GroupDTO} from './Group';

export interface ScheduleItem {
  id: number;
  startTime: Date;
  endTime: Date;
  teacher: TeacherDTO;
  subject: SubjectDTO;
  room: RoomDTO;
  groups: GroupDTO[];
}

export interface ScheduleItemPostDTO extends Omit<ScheduleItem, "id"> {
}
