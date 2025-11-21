import { ISchedule } from './schedule'

export interface GroupId {
  group: string
  spec: string
}

export interface ScheduleRepository {
  getGroupSchedule(params: GroupId): Promise<ISchedule>
}
