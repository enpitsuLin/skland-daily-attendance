import type { ArknightsAttendanceStatus, EndfieldAttendanceStatus } from 'skland-kit'

export function isTodayAttended(attendanceStatus: ArknightsAttendanceStatus): boolean
export function isTodayAttended(attendanceStatus: EndfieldAttendanceStatus): boolean
export function isTodayAttended(
  attendanceStatus: ArknightsAttendanceStatus | EndfieldAttendanceStatus,
): boolean {
  // Get today's date in Asia/Shanghai timezone (UTC+8)
  const todayInShanghai = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  if ('records' in attendanceStatus) {
    return attendanceStatus.records.some((record) => {
      // record.ts is Unix timestamp in UTC+8
      const recordDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(Number(record.ts) * 1000))
      return recordDate === todayInShanghai
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
