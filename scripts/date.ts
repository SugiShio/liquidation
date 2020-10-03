export const addMonth = (date: Date, value: number) => {
  let month = date.getMonth() + value
  let year = date.getFullYear()
  if (month < 0) {
    year--
    month += 12
  } else if (month >= 12) {
    year++
    month %= 12
  }
  return new Date(year, month)
}
