import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [isp, setIsp] = useState('');
  const [lat, setLat] = useState(51.505);
  const [lng, setLng] = useState(-0.09);

  const mapRef = useRef(null); // Create a reference to the map container

  function handleSubmit(e) {
    e.preventDefault();
    getApi();
  }

  async function getApi() {
    try {
      const url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_6RlPBdeDjp8GJlZLsjyqU0KiI3o4r&ipAddress=${ip}`;
      const response = await fetch(url);
      const data = await response.json();
      setLocation(data.location.country);
      setTimezone(`UTC${data.location.timezone}`);
      setIp(data.ip);
      setIsp(data.isp);
      setLat(data.location.lat);
      setLng(data.location.lng);
    } catch (error) {
      console.error(error);
    }
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  useEffect(() => {
    // Leaflet Map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([lat, lng], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
      L.marker([lat, lng]).addTo(mapRef.current);
    } else {
      mapRef.current.setView([lat, lng], 13);
      L.marker([lat, lng]).addTo(mapRef.current);
    }

    // Geolocation
    getLocation();
  }, [lat, lng]);

  return (
    <>
    <div className="container">
  
      <div className="inp">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="yes"
            placeholder="Search for any ip address or domain"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="info">
        <ul>
          <li>
            IP ADDRESS
            <br />
            <span id="ip">{ip}</span>
          </li>
          <hr />
          <li>
            LOCATION
            <br />
            <span id="loc">{location}</span>
          </li>
          <hr />
          <li>
            TIMEZONE
            <br />
            <span id="zone">{timezone}</span>
          </li>
          <hr />
          <li>
            ISP
            <br />
            <span id="isp">{isp}</span>
          </li>
        </ul>
      </div>
      
    </div>
    <div id="map"></div>

    </>
  );
}

export default App;
