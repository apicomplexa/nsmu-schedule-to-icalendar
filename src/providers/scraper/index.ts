import { ILesson, LessonType } from '#/types/lesson'
import { NsmuWebLoader } from './web-schedule-loader'
import { WebScheduleParser } from './web-schedule-parser'

const nsmuBaseURL =
  process.env.NSMU_BASE_URL ??
  'https://ruz.nsmu.ru/?week={week}&group={group}&spec={spec}'

const webLoader = new NsmuWebLoader(nsmuBaseURL)
const parser = new WebScheduleParser()

export interface UrlArgs {
  group: string
  spec: string
}
/**
 * Loads lessons from NSMU web schedule and parse them to objects.
 * If error returns [] (empty array)
 * @param params group and spec of NSMU web schedule
 * @returns list lessons
 */
export async function getLessons(params: UrlArgs): Promise<ILesson[]> {
  const htmlSchedule = await webLoader.loadSchedule({
    group: params.group,
    spec: params.spec,
  })
  const lessons = parser.parseWebSchedule(htmlSchedule)
  return lessons
}

/**
 * Loads lessons from NSMU web schedule and parse them to objects.
 * Filter them using `filterFunc`
 * If error returns [] (empty array)
 * @param params group and spec of NSMU web schedule, filterFunc - function for filter for lessons
 * @returns list lections
 */
async function getFilteredLessons(
  params: UrlArgs & { filterFunc: (l: ILesson) => boolean }
) {
  const lessons = await getLessons(params)
  const lections = lessons.filter(params.filterFunc)
  return lections
}

/**
 * Loads lessons from NSMU web schedule and parse them to objects.
 * Filter them by type and saves only lections.
 * If error returns [] (empty array)
 * @param params group and spec of NSMU web schedule
 * @returns list lections
 */
export async function getLections(params: UrlArgs) {
  return getFilteredLessons({
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
export async function getPractices(params: UrlArgs) {
  return getFilteredLessons({
    ...params,
    filterFunc: (l) => l.lessonType !== LessonType.lection,
  })
}
