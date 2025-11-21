import { ILesson, LessonType } from '#/types/lesson'
import { NsmuWebLoader, WebScheduleParser } from '#/providers/scraper'
import { Schedule } from '#/types/schedule'

const nsmuBaseURL =
  process.env.NSMU_BASE_URL ??
  'https://ruz.nsmu.ru/?week={week}&group={group}&spec={spec}'

export interface UrlArgs {
  group: string
  spec: string
}

class LessonsProvider {
  webLoader: NsmuWebLoader
  parser: WebScheduleParser

  constructor() {
    this.webLoader = new NsmuWebLoader(nsmuBaseURL)
    this.parser = new WebScheduleParser()
  }

  /**
   * Loads lessons from NSMU web schedule and parse them to objects.
   * If error returns [] (empty array)
   * @param params group and spec of NSMU web schedule
   * @returns list lessons
   */
  public async getLessons(params: UrlArgs): Promise<Schedule> {
    const htmlSchedule = await this.webLoader.loadSchedule({
      group: params.group,
      spec: params.spec,
    })
    const lessons = this.parser.parseWebSchedule(htmlSchedule)
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
    params: UrlArgs & { filterFunc: (l: ILesson) => boolean }
  ) {
    const lessons = await this.getLessons(params)
    const lections = lessons.filter(params.filterFunc)
    return new Schedule(...lections)
  }

  /**
   * Loads lessons from NSMU web schedule and parse them to objects.
   * Filter them by type and saves only lections.
   * If error returns [] (empty array)
   * @param params group and spec of NSMU web schedule
   * @returns list lections
   */
  public async getLections(params: UrlArgs) {
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
  public async getPractices(params: UrlArgs) {
    return this.getFilteredLessons({
      ...params,
      filterFunc: (l) => l.lessonType !== LessonType.lection,
    })
  }
}

export const lessonsProvider = new LessonsProvider()
