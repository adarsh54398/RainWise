import { z } from "zod";

// Schema for validating the city/district name input
export const WeatherFormSchema = z.object({
  // Location name must be a non-empty string.
  locationName: z.string().min(1, "Please enter a city or district name"),
});

export type WeatherFormValues = z.infer<typeof WeatherFormSchema>;
