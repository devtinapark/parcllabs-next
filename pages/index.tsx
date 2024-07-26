import React, { useState } from "react";
import { Inter } from "next/font/google";
import useSWR from "swr";
import DataTable from "@/charting/datatable";
import { defaultStyleConfig, SIZE_CONFIG } from "@/charting/utils";
import {
  STATE_ABBREVIATIONS,
  STATE_FIPS_CODES,
  LOCATION_TYPES,
  REGIONS,
} from "@/config/constants";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  data: any; // Define a more specific type if possible
}

interface SearchParams {
  query: string;
  locationType: string;
  region: string;
  stateAbbreviation: string;
  stateFipsCode: string;
  parclId: number | null;
  geoid: string;
  sortBy: string;
  sortOrder: string;
  limit: number;
  offset: number;
}

const fetcher = (url: string) => {
  return fetch(url, {
    headers: {
      Authorization: `${process.env.NEXT_PUBLIC_PARCLLABS_API_KEY}`,
      Accept: "application/json",
    },
  }).then((res) => res.json());
};

const buildQueryString = (params: SearchParams) => {
  const queryParams: Record<string, string> = {};

  if (params.query) queryParams.query = params.query;
  if (params.locationType !== "ALL")
    queryParams.location_type = params.locationType;
  if (params.region !== "ALL") queryParams.region = params.region;
  if (params.stateAbbreviation !== "ALL")
    queryParams.state_abbreviation = params.stateAbbreviation;
  if (params.stateFipsCode !== "ALL")
    queryParams.state_fips_code = params.stateFipsCode;
  if (params.parclId !== null) queryParams.parcl_id = params.parclId.toString();
  if (params.geoid) queryParams.geoid = params.geoid;
  if (params.sortBy) queryParams.sort_by = params.sortBy;
  if (params.sortOrder) queryParams.sort_order = params.sortOrder;
  queryParams.limit = params.limit.toString();
  queryParams.offset = params.offset.toString();

  return new URLSearchParams(queryParams).toString();
};

export default function Home({ data }: Props) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    locationType: "ALL",
    region: "ALL",
    stateAbbreviation: "ALL",
    stateFipsCode: "ALL",
    parclId: null,
    geoid: "",
    sortBy: "TOTAL_POPULATION",
    sortOrder: "DESC",
    limit: 12,
    offset: 0,
  });

  const [fetchData, setFetchData] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleFetchData = () => {
    setFetchData(true); // Trigger data fetching when button is clicked
  };

  const queryString = buildQueryString(searchParams);

  // Conditionally fetch data based on fetchData state
  const { data: fetchedData, error } = useSWR(
    fetchData ? `/api/proxy?${queryString}` : null, // Corrected syntax
    fetcher
  );

  if (error) return <div>Failed to load data</div>;
  if (!fetchedData && fetchData) return <div>Loading...</div>; // Show loading only when fetchData is true

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <form>
          <div>
            <label htmlFor="query">Search Query:</label>
            <input
              type="text"
              id="query"
              name="query"
              value={searchParams.query}
              onChange={handleChange}
              placeholder="Ex: New York"
            />
          </div>

          <div>
            <label htmlFor="locationType">Location Type:</label>
            <select
              id="locationType"
              name="locationType"
              value={searchParams.locationType}
              onChange={handleChange}
            >
              {LOCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region">Region:</label>
            <select
              id="region"
              name="region"
              value={searchParams.region}
              onChange={handleChange}
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stateAbbreviation">State Abbreviation:</label>
            <select
              id="stateAbbreviation"
              name="stateAbbreviation"
              value={searchParams.stateAbbreviation}
              onChange={handleChange}
            >
              {STATE_ABBREVIATIONS.map((abbreviation) => (
                <option key={abbreviation} value={abbreviation}>
                  {abbreviation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stateFipsCode">State FIPS Code:</label>
            <select
              id="stateFipsCode"
              name="stateFipsCode"
              value={searchParams.stateFipsCode}
              onChange={handleChange}
            >
              {STATE_FIPS_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="geoid">Geographic Identifier (GEOID):</label>
            <input
              type="text"
              id="geoid"
              name="geoid"
              value={searchParams.geoid}
              onChange={handleChange}
              placeholder="GEOID"
            />
          </div>

          <div>
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleChange}
            >
              <option value="TOTAL_POPULATION">Total Population</option>
              <option value="PRICE_DROP">Price Drop</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder">Sort Order:</label>
            <select
              id="sortOrder"
              name="sortOrder"
              value={searchParams.sortOrder}
              onChange={handleChange}
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </form>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>

      <div>
        <div>
          <DataTable data={fetchedData?.items || []} />
        </div>
        {/* {fetchedData && (
          <DualAxisChart
            data={fetchedData} // Adjust according to the actual data structure
            styleConfig={defaultStyleConfig}
            sizeConfig={SIZE_CONFIG}
          />
        )} */}
      </div>
    </main>
  );
}
