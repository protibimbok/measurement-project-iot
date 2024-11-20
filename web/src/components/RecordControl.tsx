import { useState, useRef, useEffect } from "react";
import { startRecording, stopRecording } from "../utils/socket";
import { addListener, removeListener } from "../utils/events";

const RecordControl = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTime = useRef(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime.current);
      }, 1000);
    };

    const startEvt = () => {
      startTime.current = Date.now();
      startTimer();
    };

    const stopEvt = () => {
      startTime.current = 0;
      clearInterval(timerRef.current);
      setElapsedTime(0);
    };

    addListener("startRecording", startEvt);
    addListener("stopRecording", stopEvt);

    return () => {
      removeListener("startRecording", startEvt);
      removeListener("stopRecording", stopEvt);
      clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center  px-4">
      <p className="text-md font-bold text-gray-800 mr-4">
        {formatTime(elapsedTime)}
      </p>
      {startTime.current ? (
        <button
          type="button"
          onClick={stopRecording}
          className="text-red-500 hover:text-red-600 text-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M6 5.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="text-green-500 hover:text-green-600 text-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <defs>
              <mask id="ipSPlay0">
                <g fill="none" strokeLinejoin="round" strokeWidth="4">
                  <path
                    fill="#fff"
                    stroke="#fff"
                    d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"
                  />
                  <path
                    fill="#000"
                    stroke="#000"
                    d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464z"
                  />
                </g>
              </mask>
            </defs>
            <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSPlay0)" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RecordControl;
