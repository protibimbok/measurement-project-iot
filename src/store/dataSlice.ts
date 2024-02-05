import { createSlice } from "@reduxjs/toolkit";

export interface LatestData {
  temp: number;
  pressure: number;
  humidity: number;
  light: number;
  co2: number;
}
export interface ChartData {
  values: number[];
  times: number[];
}

export interface EntryType {
  id: number;
  name: string;
  value: number;
  timestamp: number;
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

export const chartVals = createSlice({
  name: "chart",
  initialState: {
    values: [],
    times: [],
  } as ChartData,
  reducers: {
    setChartData(state, action) {
      const entries = action.payload as EntryType[];
      if (entries.length == 0) {
        return;
      }
      const start = Math.max(state.values.length + entries.length - 120, 0);
      const size = state.times.length - start + entries.length;

      const values = Array(size);
      const times = Array(size);
      let idx = 0,
        gIdx = start;
      for (; gIdx < state.times.length; gIdx++) {
        times[idx] = state.times[gIdx];
        values[idx] = state.values[gIdx];
        idx++;
      }
      gIdx = entries.length - 1;
      for (; gIdx > -1; gIdx--) {
        const entry = entries[gIdx];
        times[idx] = entry.timestamp;
        values[idx] = entry.value;
        idx++;
      }
      return {
        times,
        values,
      };
    },
    resetChart() {
      return {
        times: [],
        values: []
      };
    }
  },
});

export const { setLatest } = latestVals.actions;
export const { setChartData, resetChart } = chartVals.actions;

export const latestReducer = latestVals.reducer;
export const chartReducer = chartVals.reducer;
