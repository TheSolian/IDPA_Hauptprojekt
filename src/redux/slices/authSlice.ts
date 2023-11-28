import { createSlice } from '@reduxjs/toolkit'

export type AuthState = {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export const getUser = (state: { auth: AuthState }) => state.auth.user
export default authSlice.reducer
