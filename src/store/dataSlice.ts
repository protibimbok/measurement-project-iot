import { createSlice } from "@reduxjs/toolkit";

export interface LatestData {
  temp: number;
  pressure: number;
  humidity: number;
  light: number;
  co2: number;
}

export const latestVals = createSlice({
  name: "latest",
  initialState: {} as LatestData,
  reducers: {
    setLatest(_, action) {
      return action.payload;
    },
  },
});

export const { setLatest } = latestVals.actions;

export const latestReducer = latestVals.reducer;

export interface ChartData {
  values: number[];
  times: number[];
}

export const chartVals = createSlice({
  name: "latest",
  initialState: {} as LatestData,
  reducers: {
    setChartData(state, action) {
      state.temp = action.payload.temp;
      return state;
    },
  },
});

export const { setChartData } = chartVals.actions;

export const chartReducer = chartVals.reducer;
