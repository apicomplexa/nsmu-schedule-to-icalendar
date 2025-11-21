import { LessonData, LessonType } from '#/types/lesson'
import { ISchedule } from '#/types/schedule'
import { GroupId, ScheduleRepository } from '#/types/repository'
import { Schedule } from '#/data-structures/schedule'

export class LessonsProvider {
  constructor(private lessonRepo: ScheduleRepository) {}

  /**
   * Loads lessons from NSMU web schedule and parse them to objects.
   * If error returns [] (empty array)
   * @param params group and spec of NSMU web schedule
   * @returns list lessons
   */
  public async getLessons(params: GroupId): Promise<ISchedule> {
    const lessons = await this.lessonRepo.getGroupSchedule(params)
    return lessons
  }

  /**
   * Loads lessons from NSMU web schedule and parse them to objects.
   * Filter them using `filterFunc`
   * If error returns [] (empty array)
   * @param params group and spec of NSMU web schedule, filterFunc - function for filter for lessons
   * @returns list lections
   */
  private async getFilteredLessons(
    params: GroupId & { filterFunc: (l: LessonData) => boolean }
  ) {
    const schedule = await this.getLessons(params)
    const filteredSchedule = schedule.filter(params.filterFunc)
    return new Schedule(...filteredSchedule)
  }

  /**
   * Loads lessons from NSMU web schedule and parse them to objects.
   * Filter them by type and saves only lections.
   * If error returns [] (empty array)
   * @param params group and spec of NSMU web schedule
   * @returns list lections
   */
  public async getLections(params: GroupId) {
    return this.getFilteredLessons({
      ...params,
      filterFunc: (l) => l.lessonType === LessonType.lection,
    })
  }

  /**
   * Loads lessons from NSMU web schedule and parse them to objects.
   * Filter them by type and saves only NOT lections.
   * If error returns [] (empty array)
   * @param params group and spec of NSMU web schedule
   * @returns list lections
   */
  public async getPractices(params: GroupId) {
    return this.getFilteredLessons({
      ...params,
      filterFunc: (l) => l.lessonType !== LessonType.lection,
    })
  }
}

