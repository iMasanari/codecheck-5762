const paddingZero = (num: number) => ('0' + num).slice(-2)

export function checkDate(time_limit: string) {
    const [year, month, date] = time_limit.split('-')

    if (year.length !== 4) {
        return false
    }

    const time = new Date(+year, +month - 1, +date)
    const checkTime_limit = getTimeFormat(time.getFullYear(), time.getMonth() + 1, time.getDate())

    return time_limit === checkTime_limit
}

export function getTimeFormat(year: number, month: number, date: number) {
    return `${year}-${paddingZero(month)}-${paddingZero(date)}`
}