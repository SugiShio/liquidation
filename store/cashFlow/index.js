import { firestore } from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'
export const state = () => ({
  cashRecords: [],
  users: []
})

export const getters = {
  total: (state) => {
    return state.cashRecords.reduce((accumlator, record) => {
      return accumlator + record.amount
    }, 0)
  },
  usersTotal: (state, getters, rootState) => (whose) => {
    const userName = whose || rootState.userName
    const user = getters.users.find((user) => user.name === userName)
    return user ? user.paymentAmount : 0
  },
  users: (state) => {
    return state.cashRecords.reduce((accumlator, record) => {
      let result = accumlator
      const name = record.whose || 'Unknown'
      const userIndex = accumlator.findIndex((user) => user.name === name)
      if (userIndex < 0)
        result = [...result, { name, paymentAmount: record.amount }]
      else result[userIndex].paymentAmount += record.amount
      return result
    }, [])
  }
}

export const mutations = {
  resetCashRecords(state) {
    state.cashRecords = []
  },
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
      // .where('whose', '==', whose)
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          const cashRecord = new CashRecord(doc.data())
          commit('addCashRecords', { cashRecord })
        })
      })
  }
}
