import ThermoMeter from "../assets/icons/thermometer.tsx";
import Humidity from "../assets/icons/humidity.tsx";
import Pressure from "../assets/icons/pressure.tsx";
import Light from "../assets/icons/light.tsx";
import Co2 from "../assets/icons/co2.tsx";
import { useFetch } from "../utils/http.ts";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/const.ts";

interface ApiData {
  temp: number;
  pressure: number;
  humidity: number;
  light: number;
  co2: number;
}

function Stats() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<ApiData>();
  const { data: apiData } = useFetch<ApiData>(url);

  useEffect(() => {
    if (apiData) {
      setData(apiData);
    }
  }, [apiData]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setUrl(BASE_URL + `/?count=${count++}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-figure text-primary">
          <ThermoMeter className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Temperature</div>
        <div className="stat-value text-primary">{data?.temp || "N/A"}</div>
        <div className="stat-desc">degree celcius</div>
      </div>
      <div className="stat">
        <div className="stat-figure text-secondary">
          <Pressure className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Pressure</div>
        <div className="stat-value text-secondary">
          {data?.pressure || "N/A"}
        </div>
        <div className="stat-desc">bar</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <Humidity className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Humidity</div>
        <div className="stat-value text-primary">{data?.humidity || "N/A"}</div>
        <div className="stat-desc">%</div>
      </div>
      <div className="stat">
        <div className="stat-figure text-secondary">
          <Light className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Light</div>
        <div className="stat-value text-secondary">{data?.light || "N/A"}</div>
        <div className="stat-desc">lx</div>
      </div>
      <div className="stat">
        <div className="stat-figure text-primary">
          <Co2 className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">CO2</div>
        <div className="stat-value text-primary">{data?.co2 || "N/A"}</div>
        <div className="stat-desc">ppm</div>
      </div>
    </div>
  );
}

export default Stats;
