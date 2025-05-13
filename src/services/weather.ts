/**
 * Represents weather information, including rain, wind speed, humidity, and location name.
 */
export interface Weather {
  /**
   * The probability of rain (0-100).
   */
  rainProbability: number;
  /**
   * The wind speed in mph.
   */
  windSpeed: number;
  /**
   * The humidity percentage.
   */
  humidity: number;
  /**
   * The name of the location (e.g., city, region).
   */
  locationName: string;
}

/**
 * Asynchronously retrieves weather information for a given Indian city or district name.
 * This is a mock implementation. In a real scenario, this would call a weather API
 * using the provided location name (or geocode it first if needed).
 *
 * @param locationName The city or district name for which to retrieve weather data.
 * @returns A promise that resolves to a Weather object containing rain probability, wind speed, humidity, and the confirmed location name.
 */
export async function getWeather(locationName: string): Promise<Weather> {
  // TODO: Implement this by calling a real weather API using the locationName.
  // The API might return a slightly different or more canonical name, which should be used.
  // For now, we just echo back the provided name and generate random data.

  console.log(`Mocking weather for location: ${locationName}`);

  // Basic mock logic: slightly vary data based on some known names
  let rainProb = Math.floor(Math.random() * 101);
  if (locationName.toLowerCase().includes("mumbai") || locationName.toLowerCase().includes("chennai")) {
    rainProb = Math.floor(Math.random() * 41) + 60; // Higher chance of rain (60-100)
  } else if (locationName.toLowerCase().includes("delhi")) {
     rainProb = Math.floor(Math.random() * 51); // Lower chance (0-50)
  }


  return {
    rainProbability: rainProb,
    windSpeed: Math.floor(Math.random() * 20) + 5, // Random wind speed 5-25 mph
    humidity: Math.floor(Math.random() * 51) + 30, // Random humidity 30-80%
    locationName: locationName, // Echo back the input name for the mock
  };
}
