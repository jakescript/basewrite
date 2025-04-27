import { configureStore } from "@reduxjs/toolkit";
import tokenSlice from "./tokenSlice";
import storySlice from './storySlice'

export const store = configureStore({
  reducer: {
    token: tokenSlice,
    story: storySlice
  }
})
