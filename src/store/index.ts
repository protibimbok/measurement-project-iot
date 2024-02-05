import { configureStore } from "@reduxjs/toolkit";
import { latestReducer, chartReducer, LatestData } from "./dataSlice";

export interface StoreState {
  latest: LatestData
}

export default configureStore({
  reducer: {
    latest: latestReducer,
    chart: chartReducer,
  },
});
