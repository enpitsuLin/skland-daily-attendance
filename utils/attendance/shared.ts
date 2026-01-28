import type { ArknightsAttendanceStatus, EndfieldAttendanceStatus } from 'skland-kit'

export function isTodayAttended(attendanceStatus: ArknightsAttendanceStatus): boolean
export function isTodayAttended(attendanceStatus: EndfieldAttendanceStatus): boolean
export function isTodayAttended(
  attendanceStatus: ArknightsAttendanceStatus | EndfieldAttendanceStatus,
): boolean {
  const today = new Date().setHours(0, 0, 0, 0)
  if ('records' in attendanceStatus) {
    return attendanceStatus.records.some((record) => {
      return new Date(Number(record.ts) * 1000).setHours(0, 0, 0, 0) === today
    })
  }
  else {
    return attendanceStatus.hasToday
  }
}

export function formatArknightsAwards(
  awards: Array<{ resource: { name: string }, count: number }>,
): string {
  return awards.map(a => `「${a.resource.name}」${a.count}个`).join(',')
}

export function formatEndfieldAwards(
  awardIds: Array<{ id: string }>,
  resourceInfoMap: Record<string, { name: string }>,
): string {
  return awardIds.map((a) => {
    const award = resourceInfoMap[a.id]
    if (!award) {
      return `「未知奖励」1 个`
    }
    return `「${award.name}」1个`
  }).join(',')
}
