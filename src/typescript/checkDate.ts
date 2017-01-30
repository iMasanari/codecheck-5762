const paddingZero = (num: number) => ('0' + num).slice(-2)

export default function checkDate(time_limit: string) {
    const [year, month, date] = time_limit.split('-')

    if (year.length !== 4) {
        return false
    }

    const time = new Date(+year, +month - 1, +date)
    const checkTime_limit = `${time.getFullYear()}-${paddingZero(time.getMonth() + 1)}-${paddingZero(time.getDate())}`

    return time_limit === checkTime_limit
}