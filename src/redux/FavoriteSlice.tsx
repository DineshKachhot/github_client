import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteState {
  favorites: string[];
}

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: [] as string[],
  } as FavoriteState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (favorite) => favorite !== action.payload
      );
    },
  },
});

export default favoriteSlice.reducer;

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
