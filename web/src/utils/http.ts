import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "./const";
import { DataPoint } from "./types";

export interface DataRow {
  id: number;
  value: string;
  timestamp: number;
}
export const useLiveData = () => {
  const [lastId, setLastId] = useState(0);
  const isLoading = useRef(false);

  useEffect(() => {
    const fetchLatest = async () => {
      if (isLoading.current) {
        return;
      }
      isLoading.current = true;
      const res = await fetch(BASE_URL + `/refresh?last=${lastId}`).then(
        (res) => res.json()
      );
      isLoading.current = false;
      const entries = res.data;
      if (entries.length === 0 || entries[0].id <= lastId) {
        return;
      }
      const tempData: DataPoint[] = [];
      const bpData: DataPoint[] = [];
      const spo2Data: DataPoint[] = [];
      for (let i = entries.length - 1; i >= 0; i--) {
        const entry: DataRow = entries[i];
        const data = JSON.parse(entry.value);
        tempData.push({
          value: data.temp,
          timestamp: entry.timestamp,
        });
        bpData.push({
          value: data.bp,
          timestamp: entry.timestamp,
        });
        spo2Data.push({
          value: data.spo2,
          timestamp: entry.timestamp,
        });
      }
      const dataEvent = new CustomEvent("newData", {
        detail: {
          temp: tempData,
          bp: bpData,
          spo2: spo2Data,
        },
      });
      document.dispatchEvent(dataEvent);
      setLastId(entries[0].id);
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 1000);
    return () => clearInterval(interval);
  }, [lastId]);

  return [lastId, setLastId] as const;
};

export const usePaginatedData = () => {
  const lastId = useRef(0);
  const isLoading = useRef(false);
  const page = useRef(1);
  const [hasNext, setHasNext] = useState(true);
  const [entries, setEntries] = useState<DataRow[]>([]);

  const fetchLatest = useCallback(async () => {
    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    setEntries((prev) => [...prev, ...Array(5).fill(false)]);
    const res = await fetch(
      BASE_URL + `/page?last=${lastId.current}&page=${page.current}`
    ).then((res) => res.json());
    isLoading.current = false;
    const rows = res.data;
    setHasNext(rows.length === 60);
    if (rows.length === 0) {
      return;
    }
    if (!lastId.current) {
      lastId.current = rows[rows.length - 1].id;
    }
    setEntries((prev) => [...prev.slice(0, prev.length - 5), ...rows]);
    page.current++;
  }, []);

  useEffect(() => {
    setEntries([]);
    fetchLatest();
  }, [fetchLatest]);

  return [entries, fetchLatest, hasNext] as const;
};