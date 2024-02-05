import { LegacyRef, useEffect, useRef } from "react";
import { Chart, registerables } from 'chart.js';

// Register necessary Chart.js plugins
Chart.register(...registerables);

interface ChartData {
  time: number[];
  temperature: number[];
}

function createLineChart(canvasEl: HTMLCanvasElement): Chart {
  const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

  // Example data, replace it with your own data
  const data: ChartData = {
    time: [0, 1, 2, 3, 4, 5],
    temperature: [20, 22, 25, 23, 21, 19],
  };

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(75,192,192,0.4)');
  gradient.addColorStop(1, 'rgba(75,192,192,0)');

  const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.time.map(String),
      datasets: [
        {
          label: 'Temperature',
          data: data.temperature,
          borderColor: '#4CAF50',
          backgroundColor: gradient,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
        },
        y: {
          type: 'linear',
          position: 'left',
        },
      },
    },
  });

  return lineChart;
}


export default function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>();

  

  useEffect(() => {
    const chart = createLineChart(canvasRef.current!);
    return () => {
        chart.destroy();
    }
  }, []);

  return <div className="card shadow mt-10">
    <canvas className="w-full h-96" ref={canvasRef as LegacyRef<HTMLCanvasElement>}></canvas>
  </div>;
}
