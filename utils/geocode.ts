import axios from 'axios';

const isClient = typeof window !== 'undefined';

export const getBatchCoordinates = async (areas: string[]) => {
  try {
    // Make all requests in parallel using Promise.all
    const promises = areas.map(async (area: string) => {
      try {
        const coords = isClient ? await getCoordinates(area) : null;
        return { area, coords };
      } catch (err) {
        console.error("Error geocoding area:", area, err);
        return { area, coords: null };
      }
    });

    const results = await Promise.all(promises);

    // Convert the results into an object for easy lookup
    const areaCoordinates = results.reduce((acc: { [key: string]: { lat: number, lng: number } | null }, { area, coords }) => {
      acc[area] = coords;
      return acc;
    }, {});

    return areaCoordinates;
  } catch (err) {
    console.error("Error in batch geocoding:", err);
    return {};
  }
};

export const getCoordinates = async (location: string) => {

  if (!isClient) {
    return null;
  }

  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
    
    const data = await res.data;
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
