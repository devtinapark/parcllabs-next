// components/DualAxisChart.tsx

import React from "react";
import {
  defaultStyleConfig,
  createLabsLogoDict,
  saveFigure,
  sortChartData,
} from "./utils";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Plotly with SSR disabled
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface DualAxisChartProps {
  title: string;
  lineData: any[]; // Replace with appropriate type if available
  lineSeries: string;
  bar1Data?: any[]; // Replace with appropriate type if available
  bar1Series?: string;
  bar2Data?: any[]; // Replace with appropriate type if available
  bar2Series?: string;
  savePath?: string;
  yaxis1Title?: string;
  yaxis2Title?: string;
  height?: number;
  width?: number;
  styleConfig?: typeof defaultStyleConfig;
}

const DualAxisChart: React.FC<DualAxisChartProps> = ({
  title,
  lineData,
  lineSeries,
  bar1Data,
  bar1Series,
  bar2Data,
  bar2Series,
  savePath,
  yaxis1Title = "Primary Y-Axis",
  yaxis2Title = "Secondary Y-Axis",
  height = 675,
  width = 1200,
  styleConfig = defaultStyleConfig,
}) => {
  // Ensure that the data is sorted
  const sortedLineData = sortChartData(lineData);
  const sortedBar1Data = bar1Data ? sortChartData(bar1Data) : null;
  const sortedBar2Data = bar2Data ? sortChartData(bar2Data) : null;

  const fig = {
    data: [
      ...(sortedBar1Data
        ? [
            {
              type: "bar",
              x: sortedBar1Data.map((item: any) => item.date),
              y: sortedBar1Data.map((item: any) => item[bar1Series]),
              marker: {
                color: styleConfig.bar1_color,
                opacity: styleConfig.bar1_opacity,
              },
              name: bar1Series,
              yaxis: "y2",
            },
          ]
        : []),
      ...(sortedBar2Data
        ? [
            {
              type: "bar",
              x: sortedBar2Data.map((item: any) => item.date),
              y: sortedBar2Data.map((item: any) => item[bar2Series]),
              marker: {
                color: styleConfig.bar2_color,
                opacity: styleConfig.bar2_opacity,
              },
              name: bar2Series,
              yaxis: "y2",
            },
          ]
        : []),
      {
        type: "scatter",
        mode: "lines+markers",
        x: sortedLineData.map((item: any) => item.date),
        y: sortedLineData.map((item: any) => item[lineSeries]),
        line: {
          width: styleConfig.line_width,
          color: styleConfig.line_color,
        },
        marker: {
          size: styleConfig.marker_size,
          color: styleConfig.marker_color,
          line: {
            width: 1,
            color: styleConfig.marker_outline_color,
          },
        },
        name: yaxis1Title,
      },
    ].reverse(),
    layout: {
      margin: { l: 40, r: 40, t: 80, b: 40 },
      height,
      width,
      title: {
        text: title,
        y: 0.95,
        x: 0.5,
        xanchor: "center",
        yanchor: "top",
        font: styleConfig.title_font,
      },
      plot_bgcolor: styleConfig.background_color,
      paper_bgcolor: styleConfig.background_color,
      font: { color: styleConfig.font_color },
      xaxis: {
        title: "",
        showgrid: styleConfig.showgrid,
        gridwidth: styleConfig.gridwidth,
        gridcolor: styleConfig.grid_color,
        tickangle: styleConfig.tick_angle,
        tickfont: styleConfig.axis_font,
        linecolor: styleConfig.line_color_axis,
        linewidth: styleConfig.linewidth,
        titlefont: styleConfig.title_font_axis,
      },
      yaxis: {
        title: yaxis1Title,
        showgrid: styleConfig.showgrid,
        gridwidth: styleConfig.gridwidth,
        gridcolor: styleConfig.grid_color,
        tickfont: styleConfig.axis_font,
        tickprefix: styleConfig.tick_prefix,
        zeroline: false,
        linecolor: styleConfig.line_color_axis,
        linewidth: styleConfig.linewidth,
        titlefont: styleConfig.title_font_axis,
      },
      yaxis2: {
        title: yaxis2Title,
        showgrid: false,
        gridwidth: styleConfig.gridwidth,
        tickfont: styleConfig.axis_font,
        zeroline: false,
        linecolor: styleConfig.line_color_axis,
        linewidth: styleConfig.linewidth,
        overlaying: "y",
        side: "right",
        ticksuffix: styleConfig.tick_suffix,
        titlefont: styleConfig.title_font_axis,
      },
      hovermode: "x unified",
      hoverlabel: {
        bgcolor: styleConfig.hover_bg_color,
        font_size: styleConfig.hover_font_size,
        font_family: styleConfig.hover_font_family,
        font_color: styleConfig.hover_font_color,
      },
      legend: {
        x: styleConfig.legend_x,
        y: styleConfig.legend_y,
        xanchor: styleConfig.legend_xanchor,
        yanchor: styleConfig.legend_yanchor,
        font: styleConfig.legend_font,
        bgcolor: "rgba(0, 0, 0, 0)",
      },
      barmode: bar2Data ? styleConfig.barmode : "group",
    },
  };

  // Save figure logic - not implemented directly here. Consider handling it in a useEffect or other event
  // if saving is required, e.g., `saveFigure(fig, savePath, width, height);`

  return <Plot data={fig.data} layout={fig.layout} />;
};

export default DualAxisChart;
