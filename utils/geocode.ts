import fetch from 'node-fetch';

export const getBatchCoordinates = async (areas: any) => {
  try {
    // Make all requests in parallel using Promise.all
    const promises = areas.map(async (area: any) => {
      try {
        const coords = await getCoordinates(area);
        return { area, coords };
      } catch (err) {
        console.error("Error geocoding area:", area, err);
        return { area, coords: null };
      }
    });

    const results = await Promise.all(promises);

    // Convert the results into an object for easy lookup
    const areaCoordinates = results.reduce((acc, { area, coords }) => {
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
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data: any = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
