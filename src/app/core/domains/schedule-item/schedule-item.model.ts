import {Teacher} from '../teacher/teacher.model';
import {Subject} from '../subject/subject.model';
import {Room} from '../room/room.model';
import {Group} from '../group/group.model';

export interface ScheduleItem {
  id: number;
  startTime: Date;
  endTime: Date;
  teacher: Teacher;
  subject: Subject;
  room: Room;
  groups: Group[];
}

export interface ScheduleItemPost extends Omit<ScheduleItem, "id"> {
}
