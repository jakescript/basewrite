import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStoryId: null,
  currentStory: '',
  writeInput: '',
  contributions: []
}

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload
    },
    setWriteInput: (state, action) => {
      state.writeInput = action.payload
    },
    setContributions: (state, action) => {
      state.contributions = action.payload
    },
    setCurrentStoryId: (state, action) => {
      state.currentStoryId = action.payload
    }
  }
})

export const { setCurrentStory, setContributions, setWriteInput, setCurrentStoryId } = storySlice.actions
export default storySlice.reducer
