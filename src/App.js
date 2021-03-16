import React, { useEffect } from 'react';

import './App.css';
import 'leaflet/dist/leaflet.css';

import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core';

import InfoBox from './components/InfoBox/InfoBox.component';
import Map from './components/Map/Map.component';
import Table from './components/Table/Table';
import { sortData } from './Utilities/util'; 
import LineGraph from './components/Graph/LineGraph.component';

function App() {

  const [countries, setCountries] = React.useState([]);
  const [country, setCountry] = React.useState('worldwide');
  const [countryInfo, setcountryInfo] = React.useState({});
  const [tableData, settableData] = React.useState([]);
  const [mapCenter, setmapCenter] = React.useState({lat: 34.80746,lng: -40.4796});
  const [mapZoom, setmapZoom] = React.useState(3);

  // Runs a piece of code based on a given condition
  // It runs when the component is loaded or whenever the condition (state specified in the []) changes
  // if [] is empty then it means that this component will be loaded only once.

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => setcountryInfo(data));
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map( country => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          settableData(sortedData);
          setCountries(countries);
      });
    };
    getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setcountryInfo(data);
      setmapCenter( [data.countryInfo.lat, data.countryInfo.long] );
      setmapZoom(4);
    });
  }

  return (
    <div className="app">
      {
        // Header: Title + select input dropdown
        // InfoBox InfoBox InfoBox
        // Table
        // Graph
        // Map
      }
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map 
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
