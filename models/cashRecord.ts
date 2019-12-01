export default class CashRecord {
  name: string = ''
  amount: number = 0
  isPayment: boolean = true
  date: number = new Date().valueOf()
  // createdAt: Date
  constructor(data?: any) {
    if (!data) return

    this.isPayment = !!data.isPayment
    this.name = data.name || (this.isPayment ? '不明な出金' : '不明な入金')
    this.amount = (this.isPayment ? 1 : -1) * (data.amount || 0)
    this.date = data.date
    // this.createdAt = data.createdAt
  }
}
