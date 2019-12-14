export default class CashRecord {
  id: string | null = null
  name: string = ''
  amount: number = 0
  isPayment: boolean = true
  date: number = 0
  whose: string = ''
  createdAt: Date = new Date()
  constructor(data?: any, id?: string) {
    if (!data) {
      const today = new Date()
      this.date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).valueOf()
      return
    }

    this.id = id || null
    this.isPayment = !!data.isPayment
    this.name = data.name || (this.isPayment ? '不明な出金' : '不明な入金')
    this.amount = (this.isPayment ? 1 : -1) * (data.amount || 0)
    this.date = data.date
    this.whose = data.whose
    this.createdAt = data.createdAt
  }
}
