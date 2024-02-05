import { useSelector } from "react-redux";
import ThermoMeter from "../assets/icons/thermometer.tsx";
import Humidity from "../assets/icons/humidity.tsx";
import Pressure from "../assets/icons/pressure.tsx";
import Light from "../assets/icons/light.tsx";
import Co2 from "../assets/icons/co2.tsx";
import { LatestData } from "../store/dataSlice.ts";
import { StoreState } from "../store/index.ts";

function Stats({
  onClick,
  active,
}: {
  active: string;
  onClick: (val: string) => void;
}) {
  const data = useSelector((state: StoreState) => state.latest) as LatestData;

  return (
    <div className="stats shadow w-full">
      <div
        className={`stat overflow-hidden cursor-pointer ${active === "temp" && "bg-yellow-100"}`}
        onClick={() => onClick("temp")}
      >
        <div className="stat-figure text-primary">
          <ThermoMeter className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Temperature</div>
        <div className="stat-value text-primary">{data?.temp || "N/A"}</div>
        <div className="stat-desc">degree celcius</div>
      </div>
      <div
        className={`stat overflow-hidden cursor-pointer ${active === "pressure" && "bg-yellow-100"}`}
        onClick={() => onClick("pressure")}
      >
        <div className="stat-figure text-secondary">
          <Pressure className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Pressure</div>
        <div className="stat-value text-secondary">
          {data?.pressure || "N/A"}
        </div>
        <div className="stat-desc">kPa</div>
      </div>

      <div
        className={`stat overflow-hidden cursor-pointer ${active === "humidity" && "bg-yellow-100"}`}
        onClick={() => onClick("humidity")}
      >
        <div className="stat-figure text-primary">
          <Humidity className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Humidity</div>
        <div className="stat-value text-primary">{data?.humidity || "N/A"}</div>
        <div className="stat-desc">%</div>
      </div>

      <div
        className={`stat overflow-hidden cursor-pointer ${active === "light" && "bg-yellow-100"}`}
        onClick={() => onClick("light")}
      >
        <div className="stat-figure text-secondary">
          <Light className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Light</div>
        <div className="stat-value text-secondary">{data?.light || "N/A"}</div>
        <div className="stat-desc">lx</div>
      </div>

      <div
        className={`stat overflow-hidden cursor-pointer ${active === "co2" && "bg-yellow-100"}`}
        onClick={() => onClick("co2")}
      >
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
