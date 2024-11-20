import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "./const";

export interface DataRow {
  id: number;
  value: string;
  timestamp: number;
}
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
