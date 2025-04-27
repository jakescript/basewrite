import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokenIds: [],
  tokenMap: {},
  availableChars: 0,
  usedChars: 0,
  initialLimit: 0
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokenIds: (state, action) => {
      state.tokenIds = action.payload
    },
    setTokenMap: (state, action) => {
      state.tokenMap = action.payload
    },
    setAvailableChars: (state, action) => {
      state.availableChars = action.payload
    },
    setInitialLimit: (state, action) => {
      state.initialLimit = action.payload
    },
    setUsedChars: (state, action) => {
      state.usedChars = action.payload
    }
  }
})

export const { setTokenIds, setTokenMap, setAvailableChars, setInitialLimit, setUsedChars } = tokenSlice.actions
export default tokenSlice.reducer
