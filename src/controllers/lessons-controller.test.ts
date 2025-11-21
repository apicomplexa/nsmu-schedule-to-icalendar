import {
  JsonLessonsController,
  IcalLessonsController,
} from './lessons-controller'
import { LessonReq2GroupId } from '#/tools/lesson-request-to-group-id'

jest.mock('#/tools/lesson-request-to-group-id', () => ({
  LessonReq2GroupId: jest.fn(),
}))

describe('LessonsController implementations', () => {
  const mockedLessonReq2GroupId = LessonReq2GroupId as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  function makeProvider(schedule: unknown) {
    return {
      getLessons: jest.fn().mockResolvedValue(schedule),
      getLections: jest.fn().mockResolvedValue(schedule),
    }
  }

  const makeRes = () => ({
    json: jest.fn(),
    send: jest.fn(),
  })

  describe('JsonLessonsController', () => {
    it('JsonLessonsController.getLessons calls provider.getLessons and responds with res.json', async () => {
      const groupId = { id: 'g1' }
      mockedLessonReq2GroupId.mockReturnValue(groupId)

      const schedule = { foo: 'bar' }
      const provider = makeProvider(schedule)
      const controller = new JsonLessonsController(provider as any)

      const res = makeRes()
      const next = jest.fn()

      await controller.getLessons({} as any, res as any, next)

      expect(provider.getLessons).toHaveBeenCalledTimes(1)
      expect(provider.getLessons).toHaveBeenCalledWith(groupId)
      expect(res.json).toHaveBeenCalledWith(schedule)
      expect(next).toHaveBeenCalled()
    })

    it('JsonLessonsController.getLections calls provider.getLections and responds with res.json', async () => {
      const groupId = { id: 'g2' }
      mockedLessonReq2GroupId.mockReturnValue(groupId)

      const schedule = { lect: 'data' }
      const provider = makeProvider(schedule)
      const controller = new JsonLessonsController(provider as any)

      const res = makeRes()
      const next = jest.fn()

      await controller.getLections({} as any, res as any, next)

      expect(provider.getLections).toHaveBeenCalledTimes(1)
      expect(provider.getLections).toHaveBeenCalledWith(groupId)
      expect(res.json).toHaveBeenCalledWith(schedule)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('IcalLessonsController', () => {
    it('IcalLessonsController.getLessons converts schedule to iCal and responds with res.send', async () => {
      const groupId = { id: 'g3' }
      mockedLessonReq2GroupId.mockReturnValue(groupId)

      const toIcal = jest.fn().mockReturnValue('BEGIN:VCALENDAR...')
      const schedule = { toIcalSchedule: toIcal }
      const provider = makeProvider(schedule)
      const controller = new IcalLessonsController(provider as any)

      const res = makeRes()
      const next = jest.fn()

      await controller.getLessons({} as any, res as any, next)

      expect(provider.getLessons).toHaveBeenCalledTimes(1)
      expect(provider.getLessons).toHaveBeenCalledWith(groupId)
      expect(toIcal).toHaveBeenCalledTimes(1)
      expect(res.send).toHaveBeenCalledWith('BEGIN:VCALENDAR...')
      expect(next).toHaveBeenCalled()
    })

    it('IcalLessonsController.getLections converts schedule to iCal and responds with res.send', async () => {
      const groupId = { id: 'g4' }
      mockedLessonReq2GroupId.mockReturnValue(groupId)

      const toIcal = jest.fn().mockReturnValue('BEGIN:VCALENDAR:LECTIONS')
      const schedule = { toIcalSchedule: toIcal }
      const provider = makeProvider(schedule)
      const controller = new IcalLessonsController(provider as any)

      const res = makeRes()
      const next = jest.fn()

      await controller.getLections({} as any, res as any, next)

      expect(provider.getLections).toHaveBeenCalledTimes(1)
      expect(provider.getLections).toHaveBeenCalledWith(groupId)
      expect(toIcal).toHaveBeenCalledTimes(1)
      expect(res.send).toHaveBeenCalledWith('BEGIN:VCALENDAR:LECTIONS')
      expect(next).toHaveBeenCalled()
    })
  })
})
