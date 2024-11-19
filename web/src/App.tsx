import { useState } from "react";
import { BASE_URL } from "./utils/const";
import cn from "classnames";
import TableData from "./components/TableData";
import MovementRenderer from "./components/movement";

function App() {
  const [tab, setTab] = useState(0);

  const clearData = async () => {
    await fetch(BASE_URL + "/erase");
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-md">
        <div className="container mx-auto">
          <div>
            <svg
              width="78"
              height="30"
              viewBox="0 0 78 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5147 0C15.4686 0 12.5473 1.21005 10.3934 3.36396L3.36396 10.3934C1.21005 12.5473 0 15.4686 0 18.5147C0 24.8579 5.14214 30 11.4853 30C14.5314 30 17.4527 28.7899 19.6066 26.636L24.4689 21.7737C24.469 21.7738 24.4689 21.7736 24.4689 21.7737L38.636 7.6066C39.6647 6.57791 41.0599 6 42.5147 6C44.9503 6 47.0152 7.58741 47.7311 9.78407L52.2022 5.31296C50.1625 2.11834 46.586 0 42.5147 0C39.4686 0 36.5473 1.21005 34.3934 3.36396L15.364 22.3934C14.3353 23.4221 12.9401 24 11.4853 24C8.45584 24 6 21.5442 6 18.5147C6 17.0599 6.57791 15.6647 7.6066 14.636L14.636 7.6066C15.6647 6.57791 17.0599 6 18.5147 6C20.9504 6 23.0152 7.58748 23.7311 9.78421L28.2023 5.31307C26.1626 2.1184 22.5861 0 18.5147 0Z"
                fill="#394149"
              ></path>
              <path
                d="M39.364 22.3934C38.3353 23.4221 36.9401 24 35.4853 24C33.05 24 30.9853 22.413 30.2692 20.2167L25.7982 24.6877C27.838 27.8819 31.4143 30 35.4853 30C38.5314 30 41.4527 28.7899 43.6066 26.636L62.636 7.6066C63.6647 6.57791 65.0599 6 66.5147 6C69.5442 6 72 8.45584 72 11.4853C72 12.9401 71.4221 14.3353 70.3934 15.364L63.364 22.3934C62.3353 23.4221 60.9401 24 59.4853 24C57.0498 24 54.985 22.4127 54.269 20.2162L49.798 24.6873C51.8377 27.8818 55.4141 30 59.4853 30C62.5314 30 65.4527 28.7899 67.6066 26.636L74.636 19.6066C76.7899 17.4527 78 14.5314 78 11.4853C78 5.14214 72.8579 0 66.5147 0C63.4686 0 60.5473 1.21005 58.3934 3.36396L39.364 22.3934Z"
                fill="#394149"
              ></path>
            </svg>
          </div>
          <p className="text-xl font-bold ml-3">Embedded Systems</p>
          <button
            className="ml-auto btn btn-outline btn-error btn-sm"
            type="button"
            onClick={clearData}
          >
            Clear Data
          </button>
        </div>
      </div>
      <div className="container mx-auto mt-10">
        <div className="flex justify-between">
          <div role="tablist" className="tabs tabs-lifted -mb-px">
            <a
              role="tab"
              className={cn("tab !border-b-0", {
                "tab-active": tab === 0,
              })}
              onClick={() => setTab(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path
                  fill="currentColor"
                  d="M7 16a1.5 1.5 0 0 0 1.5-1.5a1 1 0 0 0 0-.15l2.79-2.79h.46l1.61 1.61v.08a1.5 1.5 0 1 0 3 0v-.08L20 9.5A1.5 1.5 0 1 0 18.5 8a1 1 0 0 0 0 .15l-3.61 3.61h-.16L13 10a1.49 1.49 0 0 0-3 0l-3 3a1.5 1.5 0 0 0 0 3m13.5 4h-17V3a1 1 0 0 0-2 0v18a1 1 0 0 0 1 1h18a1 1 0 0 0 0-2"
                />
              </svg>
              Live Data
            </a>
            <a
              role="tab"
              className={cn("tab", {
                "tab-active": tab === 1,
              })}
              onClick={() => setTab(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 26 26"
                className="mr-2"
              >
                <path
                  fill="currentColor"
                  d="M13 0L8 3l5 3V4c4.955 0 9 4.045 9 9s-4.045 9-9 9s-9-4.045-9-9c0-2.453.883-4.57 2.5-6.188L5.094 5.407C3.11 7.39 2 10.053 2 13c0 6.045 4.955 11 11 11s11-4.955 11-11S19.045 2 13 2zm-2.094 6.563l-1.812.875l2.531 5A1.5 1.5 0 0 0 11.5 13v.063L8.281 16.28l1.439 1.44l3.219-3.219H13a1.5 1.5 0 0 0 1.5-1.5c0-.69-.459-1.263-1.094-1.438z"
                />
              </svg>
              History
            </a>
          </div>
        </div>
        {tab === 0 && (
          <div className="border bg-base-100 border-base-300 rounded-box rounded-tl-none p-6">
            <MovementRenderer />
          </div>
        )}
        {tab === 1 && (
          <div className="border bg-base-100 border-base-300 rounded-box">
            <TableData />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
