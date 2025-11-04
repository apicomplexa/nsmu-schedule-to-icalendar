export const constructDate = (d: {
  year: number
  monthIndex: number
  day: number
  h: number
  min: number
}): Date => new Date(d.year, d.monthIndex, d.day, d.h, d.min)
