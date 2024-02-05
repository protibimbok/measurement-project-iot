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
  minTime: number;
  maxTime: number;
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
    minTime: 0,
    maxTime: 0,
  } as ChartData,
  reducers: {
    setChartData(state, action) {
      const entries = action.payload as EntryType[];
      if (entries.length == 0) {
        return;
      }
      const start = Math.max(state.values.length + entries.length - 120, 0);
      const values = [];
      const times = [];
      let idx = 0,
        gIdx = start;

      let minTime = state.minTime;
      let gIdx2 = entries.length - 1;
      if (state.times.length > 0) {
        minTime = state.times[start];
        for (; gIdx < state.times.length; gIdx++) {
          times[idx] = state.times[gIdx];
          values[idx] = state.values[gIdx];
          idx++;
        }
      } else {
        minTime = entries[gIdx2].timestamp;
      }

      for (; gIdx2 > -1; gIdx2--) {
        const entry = entries[gIdx2];
        times[idx] = entry.timestamp;
        values[idx] = entry.value;
        idx++;
      }
      return {
        times,
        values,
        minTime,
        maxTime: entries[0].timestamp,
      };
    },
    resetChart() {
      return {
        times: [],
        values: [],
        minTime: 0,
        maxTime: 0,
      };
    },
  },
});

export const { setLatest } = latestVals.actions;
export const { setChartData, resetChart } = chartVals.actions;

export const latestReducer = latestVals.reducer;
export const chartReducer = chartVals.reducer;
