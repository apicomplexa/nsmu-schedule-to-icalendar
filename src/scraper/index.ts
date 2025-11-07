import { ILesson } from '#/types/lesson'
import { NsmuWebLoader } from './web-schedule-loader'
import { WebScheduleParser } from './web-schedule-parser'

const nsmuBaseURL =
  process.env.NSMU_BASE_URL ??
  'https://ruz.nsmu.ru/?week={week}&group={group}&spec={spec}'

const webLoader = new NsmuWebLoader(nsmuBaseURL)
const parser = new WebScheduleParser()

export async function getLessons(
  group: string,
  spec: string
): Promise<ILesson[]> {
  const htmlSchedule = await webLoader.loadSchedule({
    group,
    spec,
  })
  const lessons = parser.parseWebSchedule(htmlSchedule)
  return lessons
}
