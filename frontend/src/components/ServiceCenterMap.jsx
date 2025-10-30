import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const ServiceCenterMap = ({ centers }) => {
  const [userLocation, setUserLocation] = useState({ lat: 10.8231, lng: 106.6297 }); // default HCM

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBAOGNM5Aqs3eL-LYk9Sx1d8cljbIqZfXM"
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }
  }, []);

  if (!isLoaded) return <div>Đang tải bản đồ...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={12}>
      {/* Marker vị trí người dùng */}
      <Marker position={userLocation} />

      {/* Marker các trung tâm */}
      {centers?.map((c, i) => (
        <Marker
          key={i}
          position={{ lat: c.latitude, lng: c.longitude }}
          label={c.name}
        />
      ))}
    </GoogleMap>
  );
};

export default ServiceCenterMap;
