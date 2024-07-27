import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Tabs, Tab, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, CircularProgress } from "@mui/material";
import { STATE_ABBREVIATIONS, STATE_FIPS_CODES, LOCATION_TYPES, REGIONS } from "@/config/constants";
import { useMutation } from "@tanstack/react-query";

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

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `${process.env.NEXT_PUBLIC_PARCLLABS_API_KEY}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const buildQueryString = (params: SearchParams) => {
  const queryParams: Record<string, string> = {};
  if (params.query) queryParams.query = params.query;
  if (params.locationType) queryParams.location_type = params.locationType;
  if (params.region) queryParams.region = params.region;
  if (params.stateAbbreviation)
    queryParams.state_abbreviation = params.stateAbbreviation;
  if (params.stateFipsCode) queryParams.state_fips_code = params.stateFipsCode;
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
    locationType: "",
    region: "",
    stateAbbreviation: "",
    stateFipsCode: "",
    parclId: null,
    geoid: "",
    sortBy: "",
    sortOrder: "",
    limit: 12,
    offset: 0,
  });

  const [queryString, setQueryString] = useState<string>("");
  const [tabIndex, setTabIndex] = useState(0);

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
    const newQueryString = buildQueryString(searchParams);
    setQueryString(newQueryString);
    fetchDataMutation.mutate(newQueryString); // Trigger mutation with updated query string
  };

  const fetchDataMutation = useMutation({
    mutationFn: async (queryString: string) => {
      const data = await fetcher(`/api/proxy?${queryString}`);
      return data;
    },
    onSuccess: (data) => {
      console.log("Data fetched successfully:", data);
    },
    onSettled: () => {
      setTabIndex(1);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tabIndex]);

  if (fetchDataMutation.isPending) {
    return (
      <div className="loading-overlay">
        <CircularProgress />
      </div>
    );
  }
  if (fetchDataMutation.isError) return <div>Failed to load data</div>;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1000, // Increase the max width for the form container
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label="Search" />
          <Tab label="Results" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <div className="form-container">
            <form className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Search Query"
                  name="query"
                  value={searchParams.query}
                  onChange={handleChange}
                  placeholder="Ex: New York"
                />
              </div>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Geographic Identifier (GEOID)"
                  name="geoid"
                  value={searchParams.geoid}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormControl fullWidth>
                  <InputLabel>Location Type</InputLabel>
                  <Select
                    name="locationType"
                    value={searchParams.locationType}
                    onChange={handleChange}
                  >
                    {LOCATION_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Region</InputLabel>
                  <Select
                    name="region"
                    value={searchParams.region}
                    onChange={handleChange}
                  >
                    {REGIONS.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region.replace("_", " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>State Abbreviation</InputLabel>
                  <Select
                    name="stateAbbreviation"
                    value={searchParams.stateAbbreviation}
                    onChange={handleChange}
                  >
                    {STATE_ABBREVIATIONS.map((abbreviation) => (
                      <MenuItem key={abbreviation} value={abbreviation}>
                        {abbreviation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>State FIPS Code</InputLabel>
                  <Select
                    name="stateFipsCode"
                    value={searchParams.stateFipsCode}
                    onChange={handleChange}
                  >
                    {STATE_FIPS_CODES.map((code) => (
                      <MenuItem key={code} value={code}>
                        {code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    name="sortBy"
                    value={searchParams.sortBy}
                    onChange={handleChange}
                  >
                    <MenuItem value="TOTAL_POPULATION">Total Population</MenuItem>
                    <MenuItem value="PRICE_DROP">Price Drop</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    name="sortOrder"
                    value={searchParams.sortOrder}
                    onChange={handleChange}
                  >
                    <MenuItem value="ASC">Ascending</MenuItem>
                    <MenuItem value="DESC">Descending</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Limit"
                  name="limit"
                  value={searchParams.limit}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 1000 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Offset"
                  name="offset"
                  value={searchParams.offset}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 1000 }}
                />
              </div>
              <div className="w-full">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFetchData}
                  className="w-full py-3 text-lg"
                >
                  Fetch Data
                </Button>
              </div>
            </form>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {fetchDataMutation.isSuccess && (
            <pre>{JSON.stringify(fetchDataMutation.data.items, null, 2)}</pre>
          )}
        </TabPanel>
      </Box>
    </main>
  );
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
