/**
 * Thanks to
 * https://usehooks-ts.com/react-hook/use-fetch
 */

import { useEffect, useReducer, useRef } from "react";

/**
 * Represents the state of an HTTP request.
 * @template T - The type of data expected in the response.
 * @interface State
 * @property {T | undefined} data - The data received from the HTTP request.
 * @property {Error | undefined} error - An error object if the request encounters an error.
 */
interface State<T> {
  data?: T;
  error?: Error;
}

/**
 * Represents a cache of data for different URLs.
 * @template T - The type of data stored in the cache.
 * @type {object} Cache
 */
type Cache<T> = Record<string, T>;

/**
 * Represents the possible actions that can be dispatched in the fetchReducer.
 * @template T - The type of data expected in the response.
 * @type {object} Action
 */
type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

export function useFetch<T = unknown>(
  url?: string,
  options?: RequestInit
): State<T> {
  const cache = useRef<Cache<T>>({});
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) return;

    cancelRequest.current = false;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      const currentCache = cache.current[url];
      if (currentCache) {
        dispatch({ type: "fetched", payload: currentCache });
        return;
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as T;
        cache.current[url] = data;
        if (cancelRequest.current) return;

        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current) return;

        dispatch({ type: "error", payload: error as Error });
      }
    };

    void fetchData();

    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return state;
}
