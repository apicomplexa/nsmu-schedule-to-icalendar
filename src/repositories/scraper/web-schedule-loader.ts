import { GroupId } from "#T/repository"

export class NsmuWebLoader {
  constructor(private readonly baseUrl: string) {}

  /**
   * Loads raw html with nsmu schedule 
   * @param param object contains string codes of group and spec for requesting schedule
   * @returns array of strings - raw html contest of webpage with schedule.
   *   Every string is webpage with schedule for one week.
   */
  async loadSchedule(param: GroupId): Promise<string[]> {
    const weekNumbers = [0, 1]
    const scheduleUrls = weekNumbers.map((week) =>
      this.constructUrlToWeekSchedule(param, week)
    )
    console.log(scheduleUrls)
    const data = await Promise.allSettled(
      scheduleUrls.map(async (url) =>
        fetch(url, {
          signal: AbortSignal.timeout(5000),
        })
      )
    )

    data
      .filter((d) => d.status === 'rejected')
      .forEach((d) => {
        console.log(d.reason)
      })

    return Promise.all(
      data
        .filter((d) => d.status === 'fulfilled')
        .map(async (d) => {
          const response = d.value
          if (response.ok) {
            return await response.text()
          }
          return ''
        })
    )
  }

  /**
   * Construct url to webpage with schedule for specific grope, spec and week
   *
   * @param week only 0 and 1 are supported due to original nsmu web schedule
   *   contains only two weeks (current and next).
   *   If any other variant will be provided, it will be replaced to 0
   */
  private constructUrlToWeekSchedule(
    param: GroupId,
    week: number
  ): string {
    const { group: group, spec } = param
    if (week !== 0 && week !== 1) {
      week = 0
    }
    return this.baseUrl
      .replace(/{group}/, group)
      .replace(/{spec}/, spec)
      .replace(/{week}/, week.toString())
  }
}
