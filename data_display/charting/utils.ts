// utils/chartUtils.ts

// Define the labsLogoLookup object
export const labsLogoLookup: Record<string, Record<string, string>> = {
  labs: {
    blue: "https://parcllabs-assets.s3.amazonaws.com/powered-by-parcllabs-api.png",
    white:
      "https://parcllabs-assets.s3.amazonaws.com/powered-by-parcllabs-api-logo-white+(1).svg",
  },
};

// Define the style configuration
export const defaultStyleConfig = {
  line_color: "#2ca02c",
  line_width: 3,
  marker_size: 8,
  marker_color: "#2ca02c",
  marker_outline_color: "#ffffff",
  bar1_color: "#1f77b4",
  bar1_opacity: 0.8,
  bar2_color: "#ff7f0e",
  bar2_opacity: 0.8,
  background_color: "#1e1e1e",
  font_color: "#ffffff",
  title_font: { size: 24, color: "#ffffff", family: "Arial Black" },
  axis_font: { size: 12, family: "Arial", color: "#ffffff" },
  title_font_axis: { size: 14, family: "Arial Black", color: "#ffffff" },
  grid_color: "rgba(255, 255, 255, 0.2)",
  line_color_axis: "rgba(255, 255, 255, 0.7)",
  hover_bg_color: "#2f2f2f",
  hover_font_size: 12,
  hover_font_family: "Arial",
  hover_font_color: "#ffffff",
  legend_font: { size: 12, color: "#ffffff", family: "Arial" },
  legend_x: 0.01,
  legend_y: 0.98,
  legend_xanchor: "left",
  legend_yanchor: "top",
  tick_angle: -45,
  tick_prefix: "$",
  tick_suffix: " units",
  showgrid: true,
  gridwidth: 0.5,
  linewidth: 1,
  barmode: "stack", // Use 'group' if you prefer grouping
};

// Define size configurations
export const SIZE_CONFIG = {
  x: { height: 675, width: 1200 },
  instgram_square: { height: 1080, width: 1080 },
  instagram_portrait: { height: 1080, width: 1350 },
  instagram_landscape: { height: 1080, width: 566 },
  linkedin: { height: 627, width: 1200 },
  blog: { height: 630, width: 1200 },
};

// TypeScript types for the parameters
interface CreateLabsLogoDictParams {
  src?: string;
  color?: string;
  xref?: string;
  yref?: string;
  x?: number;
  y?: number;
  sizex?: number;
  sizey?: number;
  xanchor?: string;
  yanchor?: string;
}

export const createLabsLogoDict = ({
  src = "labs",
  color = "white",
  xref = "paper",
  yref = "paper",
  x = 1,
  y = 0,
  sizex = 0.15,
  sizey = 0.15,
  xanchor = "right",
  yanchor = "bottom",
}: CreateLabsLogoDictParams) => {
  const source = labsLogoLookup[src]?.[color] || labsLogoLookup[src]?.["white"];
  return {
    source,
    xref,
    yref,
    x,
    y,
    sizex,
    sizey,
    xanchor,
    yanchor,
  };
};

// TypeScript type for the figure parameter
interface SaveFigureParams {
  write_image: (
    path: string,
    options: { width: number; height: number }
  ) => void;
}

export const saveFigure = (
  fig: SaveFigureParams,
  savePath: string,
  width: number = 800,
  height: number = 600
) => {
  if (savePath) {
    fig.write_image(savePath, { width, height });
  }
};

// Assume DataFrame is represented by an array of objects
type DataFrame = Array<Record<string, any>>;

export const sortChartData = (df: DataFrame) => {
  if (df.length > 0 && "date" in df[0]) {
    return df.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
  return df;
};
