'use server';

/**
 * @fileOverview A weather summary AI agent.
 *
 * - getWeatherSummary - A function that handles the weather summary process.
 * - GetWeatherSummaryInput - The input type for the getWeatherSummary function.
 * - GetWeatherSummaryOutput - The return type for the getWeatherSummary function.
 */

import {ai} from '@/ai/ai-instance';
import {getWeather, Weather} from '@/services/weather';
import {z} from 'genkit';

const GetWeatherSummaryInputSchema = z.object({
  locationName: z.string().describe('The city or district name in India for the weather forecast.'), // Changed from pincode
});
export type GetWeatherSummaryInput = z.infer<typeof GetWeatherSummaryInputSchema>;

const GetWeatherSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the weather forecast.'),
  locationName: z.string().describe('The name of the location for the forecast.'),
});
export type GetWeatherSummaryOutput = z.infer<typeof GetWeatherSummaryOutputSchema>;

export async function getWeatherSummary(input: GetWeatherSummaryInput): Promise<GetWeatherSummaryOutput> {
  return getWeatherSummaryFlow(input);
}

const weatherTool = ai.defineTool({
  name: 'getWeather',
  description: 'Retrieves weather information for a given Indian city or district name.', // Updated description
  inputSchema: z.object({
    locationName: z.string().describe('The city or district name for which to retrieve weather data.'), // Changed from pincode
  }),
  outputSchema: z.object({
    rainProbability: z.number().describe('The probability of rain (0-100).'),
    windSpeed: z.number().describe('The wind speed in mph.'),
    humidity: z.number().describe('The humidity percentage.'),
    locationName: z.string().describe('The name of the location (e.g., city, district).'),
  }),
},
async input => {
    const weather = await getWeather(input.locationName); // Use locationName
    return {
      rainProbability: weather.rainProbability,
      windSpeed: weather.windSpeed,
      humidity: weather.humidity,
      locationName: weather.locationName,
    };
  }
);

const prompt = ai.definePrompt({
  name: 'weatherSummaryPrompt',
  input: {
    schema: GetWeatherSummaryInputSchema, // Use updated input schema
  },
  output: {
    schema: GetWeatherSummaryOutputSchema,
  },
  tools: [weatherTool],
  prompt: `You are an AI assistant providing weather forecasts for farmers in India.
  Based on the city or district name provided, use the getWeather tool to get the weather forecast.
  Generate a concise summary for the farmer, mentioning the location name.
  Location Name: {{{locationName}}}.
  The summary should include the likelihood of rain, wind speed and humidity.
  Also, ensure the 'locationName' field in the output contains the location name provided by the tool (or the input if the tool doesn't override).
  `, // Updated prompt to use locationName
});

const getWeatherSummaryFlow = ai.defineFlow<
  typeof GetWeatherSummaryInputSchema,
  typeof GetWeatherSummaryOutputSchema
>({
  name: 'getWeatherSummaryFlow',
  inputSchema: GetWeatherSummaryInputSchema, // Use updated input schema
  outputSchema: GetWeatherSummaryOutputSchema,
},
async input => {
  const {output} = await prompt(input); // Pass the input directly (contains locationName)

  // The prompt instructs the LLM to include locationName.
  // If it's missing, we might try to get it directly, although getWeather now takes locationName.
  // The primary source should ideally be the tool's output via the LLM.
  if (!output?.locationName) {
     console.warn("LLM did not return locationName in the output object. Using input location name as fallback.");
     // Use the input location name as a fallback if the LLM fails to populate it.
     return {
        summary: output?.summary || "Weather summary unavailable.",
        locationName: input.locationName // Use the name provided in the input
     };
  }

  // Check if the LLM returned a different location name than the input (might happen if the tool resolves to a more specific name)
  if (output.locationName !== input.locationName) {
    console.log(`LLM/Tool returned location name "${output.locationName}" which differs from input "${input.locationName}". Using the returned name.`);
  }

  return output!;
});
