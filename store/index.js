export const state = () => ({
  isSignin: false,
  userName: ''
})

export const mutations = {
  setUser(state, { user }) {
    state.isSignin = true
    state.userName = user.displayName
  },
  resetUser(state) {
    state.isSignin = false
    state.userName = ''
  }
}

export const actions = {
  updateUser: ({ commit }, { user }) => {
    commit('setUser', { user })
  },
  signout: ({ commit }) => {
    commit('resetUser')
  }
}
