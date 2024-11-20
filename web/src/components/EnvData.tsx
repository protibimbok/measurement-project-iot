import { useEffect } from "react";
import LineChart from "./LineChart";
import { DataPoint, SocketData } from "../utils/types";
import { addListener, emitEvent, removeListener } from "../utils/events";

const EnvData = () => {
  useEffect(() => {
    const onData = (data: SocketData) => {
      emitEvent<Record<string, DataPoint>>("newEnvData", {
        temperature: {
          timestamp: data.timestamp,
          value: data.value.temperature,
        },
        gas: {
          timestamp: data.timestamp,
          value: data.value.gas,
        },
      });
    };
    addListener("sensorData", onData);
    return () => removeListener("sensorData", onData);
  }, []);

  return (
    <div className="relative grid grid-cols-2 gap-4 p-4">
      <div className="rounded-md border border-gray-100">
        <div className="flex items-center justify-between border-b">
          <h2 className="m-0 p-3 text-lg font-bold">Temperature</h2>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => emitEvent<string>("clearLineChart", "temperature")}
          >
            Clear
          </button>
        </div>
        <LineChart name="temperature" />
      </div>
      <div className="rounded-md border border-gray-100">
        <div className="flex items-center justify-between border-b">
          <h2 className="m-0 p-3 text-lg font-bold">Gas</h2>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => emitEvent<string>("clearLineChart", "gas")}
          >
            Clear
          </button>
        </div>
        <LineChart name="gas" />
      </div>
    </div>
  );
};

export default EnvData;
