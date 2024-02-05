import { configureStore } from "@reduxjs/toolkit";
import { latestReducer, chartReducer, LatestData, ChartData } from "./dataSlice";

export interface StoreState {
  latest: LatestData;
  chart: ChartData;
}

export default configureStore({
  reducer: {
    latest: latestReducer,
    chart: chartReducer,
  },
});
