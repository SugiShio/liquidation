import { firestore } from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'
export const state = () => ({
  cashRecords: []
})

export const getters = {
  getTotal: (state) => {
    return state.cashRecords.reduce((accumlator, record) => {
      return accumlator + record.amount
    }, 0)
  }
}

export const mutations = {
  addCashRecords(state, { cashRecord }) {
    state.cashRecords.push(cashRecord)
  }
}

export const actions = {
  fetchScopedRecords: ({ commit }, { startDate, endDate } = {}) => {
    const today = new Date()
    if (!startDate) startDate = new Date(today.getFullYear(), today.getMonth())
    if (!endDate)
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1)
    const collection = firestore.collection('cashRecords')
    collection
      .orderBy('date')
      .where('date', '>=', startDate.valueOf())
      .where('date', '<', endDate.valueOf())
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          const cashRecord = new CashRecord(doc.data())
          commit('addCashRecords', { cashRecord })
        })
      })
  }
}
