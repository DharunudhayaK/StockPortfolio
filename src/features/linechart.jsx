import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { Paper } from "@mui/material";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

function PortfolioLineChart({ data, isDark }) {
  const DARK_BACKGROUND = "#1A1A1A"; // Dark background for the chart container
  const DARK_BORDER = "#333333"; // Dark border color
  const DARK_AXIS_COLOR = "#A0AAAB"; // Light gray for axis ticks/labels
  const DARK_GRID_COLOR = "rgba(255, 255, 255, 0.1)"; // Very faint white grid

  const labels = data
    .sort((a, b) => a.time - b.time)
    .map((item) => new Date(item.time));

  const values = data.sort((a, b) => a.time - b.time).map((item) => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Portfolio Value",
        data: values,
        borderColor: "#3b82f6",
        backgroundColor: isDark
          ? "rgba(59, 130, 246, 0.2)"
          : "rgba(59, 130, 246, 0.5)",
        pointBackgroundColor: "#1d4ed8",
        pointBorderColor: "#1d4ed8",
        fill: "origin",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        type: "time",
        time: { unit: "minute" },
        grid: {
          color: isDark ? DARK_GRID_COLOR : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: isDark ? DARK_AXIS_COLOR : "#374151",
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: isDark ? DARK_GRID_COLOR : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: isDark ? DARK_AXIS_COLOR : "#374151",
        },
      },
    },

    plugins: {
      legend: {
        display: true,
        labels: {
          color: isDark ? DARK_AXIS_COLOR : "#111827",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Paper
      className="shadow-none px-2 py-5 "
      elevation={0}
      sx={{
        border: isDark ? `1px solid ${DARK_BORDER}` : "1px solid #dedede",
        bgcolor: isDark ? DARK_BACKGROUND : "white",
        height: "350px",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Line data={chartData} options={options} />
    </Paper>
  );
}

export default React.memo(PortfolioLineChart);
