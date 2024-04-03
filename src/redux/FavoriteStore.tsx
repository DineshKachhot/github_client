import { configureStore } from "@reduxjs/toolkit";
import FavoriteSlice from "./FavoriteSlice";

const favoriteStore = configureStore({
  reducer: FavoriteSlice,
});

export default favoriteStore;
