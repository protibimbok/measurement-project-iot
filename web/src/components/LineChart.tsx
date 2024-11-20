import { LegacyRef, useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { DataPoint } from "../utils/types";
import { addListener, removeListener } from "../utils/events";

// Register necessary Chart.js plugins
Chart.register(...registerables);

interface ChartDataLocal {
  times: number[];
  values: number[];
}

function createLineChart(
  canvasEl: HTMLCanvasElement,
  data: ChartDataLocal
): Chart {
  const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(75,192,192,0.4)");
  gradient.addColorStop(1, "rgba(75,192,192,0)");

  const lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.times,
      datasets: [
        {
          label: "Value",
          data: data.values,
          borderColor: "#4CAF50",
          backgroundColor: gradient,
          cubicInterpolationMode: "monotone",
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          ticks: {
            callback: (value) => {
              const date = new Date((value as number));
              return date.toTimeString().split(" ")[0].split(':').slice(0, 2).join(':');
            },
          },
        },
        y: {
          type: "linear",
          position: "left",
        },
      },
      maintainAspectRatio: false,
      animation: false,
    },
  });

  return lineChart;
}

interface ChartProps {
  name: string;
}

const LINE_ENTRIES = 100;

export default function LineChart({ name }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [chart, setChart] = useState<Chart>();
  const chartRef = useRef<Chart>();
  const dataRef = useRef<ChartDataLocal>({ times: [], values: [] });
  const minMaxRef = useRef({
    min: Math.floor(Date.now() / 1000) - LINE_ENTRIES * 2,
    max: Math.floor(Date.now() / 1000),
  });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const chart = createLineChart(canvasRef.current, dataRef.current);
    setChart(chart);
    chartRef.current = chart;

    const data = dataRef.current;
    const addData = (detail: Record<string, DataPoint>) => {
      let min = data.times[0],
        max = data.times.at(-1) || 0;
      const dataPoint = detail[name];
      data.times.push(dataPoint.timestamp);
      data.values.push(dataPoint.value);
      if (data.times.length > LINE_ENTRIES) {
        data.times.shift();
        data.values.shift();
        min = data.times[0];
      }
      max = data.times[data.times.length - 1];

      minMaxRef.current.min = min;
      minMaxRef.current.max = max;
      const chart = chartRef.current;
      if (!chart) {
        return;
      }

      chart.data.labels = data.times;
      chart.data.datasets[0].data = data.values;
      chart.options!.scales!.x!.min = min;
      chart.options!.scales!.x!.max = max + 5;
      chart.update();
    };

    const clear = (cName: string) => {
      if (cName !== name) {
        return;
      }
      dataRef.current.times = [];
      dataRef.current.values = [];
      data.times = [];
      data.values = [];
      chart.update();
    }

    addListener("newEnvData", addData);
    addListener("clearLineChart", clear);
    return () => {
      setChart(undefined);
      chart.destroy();
      removeListener("newEnvData", addData);
      removeListener("clearLineChart", clear);
    };
  }, [name]);

  useEffect(() => {
    chartRef.current = chart;
    if (!chart) {
      return;
    }
    chart.data.labels = dataRef.current.times;
    chart.data.datasets[0].data = dataRef.current.values;
    chart.options!.scales!.x!.min = minMaxRef.current.min;
    chart.options!.scales!.x!.max = minMaxRef.current.max + 5;
    chart.update();
  }, [chart]);

  return (
    <div className="">
      <canvas
        className="w-full h-[350px]"
        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
      ></canvas>
    </div>
  );
}
