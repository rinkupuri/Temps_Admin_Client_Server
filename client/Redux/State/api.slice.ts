import { User } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using the User type or null for no user
const initialState: { user: User | null } = {
  user: null, // Now we can set user to null
};

// Create the user slice
const apiSlicer = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the user data (for login or user fetch)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // Sets the user in the state
    },
    // Action to clear the user data (for logout)
    clearUser: (state) => {
      state.user = null; // Clears the user, setting the state to null
    },
  },
});

// Export actions
export const { setUser, clearUser } = apiSlicer.actions;

// Export the reducer
export default apiSlicer.reducer;
