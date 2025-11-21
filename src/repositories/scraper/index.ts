import { ScheduleRepository } from '#/types/repository'
import { Schedule } from '#/data-structures/schedule'
import { NsmuWebLoader } from './web-schedule-loader'
import { WebScheduleParser } from './web-schedule-parser'

const nsmuBaseURL =
  process.env.NSMU_BASE_URL ??
  'https://ruz.nsmu.ru/?week={week}&group={group}&spec={spec}'

export interface UrlArgs {
  group: string
  spec: string
}

interface Loader {
  loadSchedule(params: UrlArgs): Promise<string[]>
}
interface Parser {
  parseWebSchedule(htmlSchedule: string[]): Schedule
}

class NsmuWebScheduleRepository implements ScheduleRepository {
  constructor(
    private loader: Loader,
    private parser: Parser
  ) {}

  public async getGroupSchedule(params: UrlArgs): Promise<Schedule> {
    const htmlSchedule = await this.loader.loadSchedule({
      group: params.group,
      spec: params.spec,
    })
    const lessons = this.parser.parseWebSchedule(htmlSchedule)
    return new Schedule(...lessons)
  }
}

export const webScraperRepo = new NsmuWebScheduleRepository(
  new NsmuWebLoader(nsmuBaseURL),
  new WebScheduleParser()
)
