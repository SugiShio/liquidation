import { firestore } from '~/plugins/firebase.js'
export const state = () => ({
  isSignin: false,
  userName: '',
  localUser: {},
  uid: null,
  room: {},
  currentRoomId: null
})

export const getters = {
  userName: (state) => {
    return state.localUser.displayName || state.userName
  }
}

export const mutations = {
  setCurrentRoomId(state, { currentRoomId }) {
    state.currentRoomId = currentRoomId
  },
  setRoom(state, { room }) {
    state.room = room
  },
  setUser(state, { user, localUser }) {
    state.isSignin = true
    state.userName = user.displayName
    state.localUser = localUser
    state.uid = user.uid
  },
  resetUser(state) {
    state.isSignin = false
    state.userName = ''
    state.localUser = {}
    state.uid = null
  }
}

export const actions = {
  setUp: ({ commit, state }, { user }) => {
    return fetchItem({ collectionName: 'users', id: user.uid })
      .then((localUser) => {
        commit('setUser', { user, localUser: { ...localUser } })
        commit('setCurrentRoomId', { currentRoomId: localUser.rooms[0] })
        return fetchItem({
          collectionName: 'rooms',
          id: state.currentRoomId
        })
      })
      .then((room) => {
        commit('setRoom', { room })
      })
      .catch((e) => {
        throw e
      })
  },

  signout: ({ commit }) => {
    commit('resetUser')
  }
}

const fetchItem = ({ collectionName, id }) => {
  const collection = firestore.collection(collectionName)
  return collection
    .doc(id)
    .get()
    .then((doc) => {
      return doc.data()
    })
}
