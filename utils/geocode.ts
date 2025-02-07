import NodeGeocoder from "node-geocoder";
import fetch from 'node-fetch';

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  fetch: fetch
});

export const getCoordinates = async (location: string) => {
  try {
    const res = await geocoder.geocode(location);
    if (res.length > 0) {
      return { lat: res[0].latitude, lng: res[0].longitude };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
