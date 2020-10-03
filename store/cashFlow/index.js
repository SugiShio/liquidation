import { firestore } from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'
export const state = () => ({
  cashRecords: []
})
const sum = (array) => {
  return array.reduce((accumlator, current) => {
    return accumlator + current
  }, 0)
}

export const getters = {
  total: (state) => {
    return sum(state.cashRecords.map((record) => record.amount))
  },
  usersTotal: (state, getters, rootState) => (uid) => {
    const whose = uid || rootState.uid
    return sum(
      state.cashRecords
        .filter((record) => record.whose === whose)
        .map((record) => record.amount)
    )
  }
}

export const mutations = {
  setCashRecords(state, { cashRecords }) {
    state.cashRecords = [...cashRecords]
  }
}

export const actions = {
  fetchScopedRecords: ({ commit, rootState }, { startDate, endDate } = {}) => {
    if (!rootState.currentRoomId) return

    const today = new Date()
    if (!startDate) startDate = new Date(today.getFullYear(), today.getMonth())
    if (!endDate)
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1)

    const roomsCollection = firestore.collection('rooms')
    const collection = roomsCollection
      .doc(rootState.currentRoomId)
      .collection('cashRecords')
    return collection
      .orderBy('date')
      .where('date', '>=', startDate.valueOf())
      .where('date', '<', endDate.valueOf())
      .get()
      .then((querySnapShot) => {
        const cashRecords = []
        querySnapShot.forEach((doc) => {
          cashRecords.push(new CashRecord(doc.data(), doc.id))
        })
        commit('setCashRecords', { cashRecords })
      })
      .catch((e) => console.error(e))
  }
}
