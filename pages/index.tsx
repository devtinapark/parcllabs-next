import { useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { GetStaticProps } from "next";
import DualAxisChart from "@/charting/default_charts";
import { defaultStyleConfig, SIZE_CONFIG } from "@/charting/utils";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  data: any;
}

interface ChartData {
  date: string[];
  "% Price Drops": number[];
  "Total Supply": number[];
}

interface DataPoint {
  date: string;
  "% Price Drops": number;
  "Total Supply": number;
}

const TEMPORARY_DATA: ChartData = {
  date: ["2024-01-01", "2024-02-01", "2024-03-01"],
  "% Price Drops": [5, 10, 15],
  "Total Supply": [1000, 800, 600],
};

// Convert ChartData to an array of DataPoints
const convertToDataPoints = (data: ChartData): DataPoint[] => {
  return data.date.map((date, index) => ({
    date,
    "% Price Drops": data["% Price Drops"][index],
    "Total Supply": data["Total Supply"][index],
  }));
};

const dataPoints = convertToDataPoints(TEMPORARY_DATA);

export default function Home({ data }: Props) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <DualAxisChart
        title="Tampa City: % of Inventory with Price Drops vs Total Supply"
        lineData={dataPoints}
        lineSeries="% Price Drops"
        bar1Data={dataPoints}
        bar1Series="Total Supply"
        yaxis1Title="% Price Drops"
        yaxis2Title="Total Supply"
        height={SIZE_CONFIG.x.height}
        width={SIZE_CONFIG.x.width}
        styleConfig={defaultStyleConfig}
        // Uncomment to save figure
        // savePath='tampa_market_price_drops.png'
      />
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch data from API
    // const response = await fetch('https://api.parcllabs.com/v1/investor_metrics/2887280/purchase_to_sale_ratio?limit=1', {
    const response = await fetch(
      "https://api.parcllabs.com/v1/investor_metrics/2887280/purchase_to_sale_ratio?limit=1",
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PARCLLABS_API_KEY || "",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("data", data);
    // Return fetched data directly
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Return default props or handle error case
    return {
      props: {
        data: {}, // Empty object or appropriate error handling
      },
    };
  }
};
