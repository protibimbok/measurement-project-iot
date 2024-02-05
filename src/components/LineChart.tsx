import { LegacyRef, useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useSelector } from "react-redux";
import { StoreState } from "../store";
import { ChartData } from "../store/dataSlice";

// Register necessary Chart.js plugins
Chart.register(...registerables);

function createLineChart(canvasEl: HTMLCanvasElement, data: ChartData): Chart {
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
          position: "bottom"
        },
        y: {
          type: "linear",
          position: "left",
        },
      },
      maintainAspectRatio: false,
    },
  });

  return lineChart;
}

export default function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>();

  const data = useSelector((state: StoreState) => state.chart) as ChartData;
  const [chart, setChart] = useState<Chart>();

  useEffect(() => {
    
    if (!canvasRef.current) {
      return;
    }
    const chart = createLineChart(canvasRef.current, {
      times: [],
      values: [],
    });
    setChart(chart);
    return () => {
      setChart(undefined);
      chart.destroy();
    };
  }, []);

  useEffect(() => {
    if (!chart) {
      return;
    }
    chart.data.labels = data.times;
    chart.data.datasets[0].data = data.values;
    chart.update();
  }, [chart, data]);

  return (
    <div className="card shadow mt-10">
      <canvas
        className="w-full h-[650px]"
        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
      ></canvas>
    </div>
  );
}
