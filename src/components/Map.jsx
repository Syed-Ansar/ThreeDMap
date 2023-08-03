/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_API_KEY;
const YOUR_INITIAL_LONGITUDE = 80.61041235105874;
const YOUR_INITIAL_LATITUDE = 23.81023831793465;
const YOUR_INITIAL_ZOOM = 4;

const Map = ({ setCapturedImage, isCapturing, setIsCapturing }) => {
  const mapContainerRef = useRef(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  const [mapCoordinates, setMapCoordinates] = useState({
    lng: YOUR_INITIAL_LONGITUDE,
    lat: YOUR_INITIAL_LATITUDE,
    zoom: YOUR_INITIAL_ZOOM,
  });

  const [location, setLocation] = useState({
    latitude: 80,
    longitude: 23,
  });

  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/dark-v11");
  const [dark, setDark] = useState(false);

  //The captureMap function is defined to capture the map as an image.
  function captureMap() {
    if (!isCapturing) {
      setIsCapturing(true);
      const map = mapContainerRef.current.getMap();
      if (map) {
        map.once("render", function () {
          const canvas = map.getCanvas();
          if (canvas) {
            const capturedMap = canvas.toDataURL("image/png");
            setCapturedImage(capturedMap);
            setIsCapturing(false);
          }
        });
        map.triggerRepaint();
      }
    }
  }

  function handleMapChange() {
    if (mapStyle === "mapbox://styles/mapbox/navigation-night-v1") {
      setMapStyle("mapbox://styles/mapbox/dark-v11");
      setDark(true);
    } else {
      setMapStyle("mapbox://styles/mapbox/navigation-night-v1");
      setDark(false);
    }
  }

  async function handleSearch() {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInputValue}.json?access_token=${mapboxgl.accessToken}`
    );
    console.log(response);
    const data = await response.json();
    const searchLongitude = data["features"][0]["center"][0];
    const searchLatitude = data["features"][0]["center"][1];
    setLocation({
      longitude: searchLongitude,
      latitude: searchLatitude,
    });
    setMapCoordinates({
      longitude: searchLongitude,
      latitude: searchLatitude,
      zoom: 6,
    });
  }

  function success(position) {
    let coord = position.coords;
    setMapCoordinates({
      longitude: coord.longitude,
      latitude: coord.latitude,
      zoom: 4,
    });
  }

  function error(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
    setMapCoordinates({
      longitude: YOUR_INITIAL_LONGITUDE,
      latitude: YOUR_INITIAL_LATITUDE,
      zoom: YOUR_INITIAL_ZOOM,
    });
  }

  useEffect(() => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  return (
    <div className="container">
      <div>
        <div className="btn">
          <button onClick={handleMapChange}>
            {dark ? "Night View" : "Dark View"}
          </button>
          <button onClick={captureMap}>Capture Map</button>
          <div>
            <input
              type="text"
              placeholder="Enter Location"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="Map">
          <ReactMapGL
            {...mapCoordinates}
            onMove={(evt) => setMapCoordinates(evt.mapCoordinates)}
            ref={mapContainerRef}
            style={{ width: 500, height: 500 }}
            mapStyle={mapStyle}
            mapboxAccessToken={mapboxgl.accessToken}
          >
            <Marker
              longitude={location.longitude}
              latitude={location.latitude}
              color="red"
            />
          </ReactMapGL>
        </div>
      </div>
    </div>
  );
};

export default Map;
