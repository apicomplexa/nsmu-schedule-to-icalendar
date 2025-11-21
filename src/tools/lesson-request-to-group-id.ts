import { GroupId } from "#T/repository"
import { LessonRequest } from "#T/lesson-request"

export function LessonReq2GroupId (req: LessonRequest): GroupId {
  return {
    group: `${req.params.curse}/${req.params.group}`,
    spec: req.params.spec,
  }
}