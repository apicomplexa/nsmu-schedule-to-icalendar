import { NsmuWebLoader } from './web-schedule-loader'

describe('NsmuWebLoader', () => {
  const baseUrl = 'https://nsmu.ru/schedule/{spec}/{group}/{week}'
  let loader: NsmuWebLoader

  beforeEach(() => {
    loader = new NsmuWebLoader(baseUrl)
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructUrlToWeekSchedule', () => {
    it('should replace placeholders correctly', () => {
      // @ts-ignore
      const url = loader['constructUrlToWeekSchedule'](
        { group: '101', spec: 'spec' },
        1
      )
      expect(url).toBe('https://nsmu.ru/schedule/spec/101/1')
    })

    it('should replace invalid week number with 0', () => {
      // @ts-ignore
      const url = loader['constructUrlToWeekSchedule'](
        { group: '202', spec: 'dent' },
        99
      )
      expect(url).toBe('https://nsmu.ru/schedule/dent/202/0')
    })
  })

  describe('loadSchedule', () => {
    it('should return html content for fulfilled and ok responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html>week0</html>',
      })
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html>week1</html>',
      })

      const result = await loader.loadSchedule({ group: '101', spec: 'med' })

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual(['<html>week0</html>', '<html>week1</html>'])
    })

    it('should return empty string if response is not ok', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => '<html>bad</html>',
      })
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html>good</html>',
      })

      const result = await loader.loadSchedule({ group: '101', spec: 'med' })

      expect(result).toEqual(['', '<html>good</html>'])
    })

    it('should skip rejected requests and log error', async () => {
      const error = new Error('Network failed')
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      ;(fetch as jest.Mock).mockRejectedValueOnce(error).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html>week1</html>',
      })

      const result = await loader.loadSchedule({ group: '303', spec: 'pharm' })

      expect(result).toEqual(['<html>week1</html>'])
      expect(logSpy).toHaveBeenCalledWith(error)
      logSpy.mockRestore()
    })
  })
})
