"use client";

import * as React from "react";
import { Leaf, MapPin } from "lucide-react";
import { WeatherForm } from "@/components/weather-form";
import { PredictionDisplay } from "@/components/prediction-display";
import { useToast } from "@/hooks/use-toast";
import { getWeatherSummary, GetWeatherSummaryOutput } from "@/ai/flows/get-weather-summary";
import { WeatherFormValues } from "@/lib/schema";
import { getWeather, Weather } from "@/services/weather";

export default function Home() {
  const [prediction, setPrediction] = React.useState<GetWeatherSummaryOutput | null>(null);
  const [weatherDetails, setWeatherDetails] = React.useState<Weather | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGetPrediction = async (values: WeatherFormValues) => {
    setIsLoading(true);
    setPrediction(null); // Clear previous prediction
    setWeatherDetails(null); // Clear previous details
    try {
      // Fetch the summary and location name from the AI flow using locationName
      const summaryResult = await getWeatherSummary({ locationName: values.locationName });
      setPrediction(summaryResult);

      // Fetch detailed weather data directly using locationName
      const detailsResult = await getWeather(values.locationName);
      setWeatherDetails(detailsResult);

       // Ensure prediction state has the location name from details if AI missed it or if it was different
       // (though the flow now uses the name directly)
      if (summaryResult && detailsResult.locationName && summaryResult.locationName !== detailsResult.locationName) {
         console.warn("AI location name differs from direct fetch, using direct fetch result.");
         setPrediction(prev => prev ? { ...prev, locationName: detailsResult.locationName } : null);
      } else if (summaryResult && !summaryResult.locationName && detailsResult.locationName) {
         setPrediction(prev => prev ? { ...prev, locationName: detailsResult.locationName } : null);
      }


    } catch (error) {
      console.error("Error fetching weather prediction:", error);
      toast({
        title: "Error",
        description: "Failed to get weather prediction. Please try again.",
        variant: "destructive",
      });
       setPrediction(null); // Clear prediction on error
       setWeatherDetails(null); // Clear details on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-secondary">
      <div className="w-full max-w-lg text-center mb-10">
         <div className="flex justify-center items-center mb-4">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
        <h1 className="text-4xl font-bold text-primary mb-2">RainWise</h1>
        <p className="text-lg text-muted-foreground">
          Enter your Indian city or district name to get a rain prediction for your farm. {/* Updated text */}
        </p>
      </div>

      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <WeatherForm onSubmit={handleGetPrediction} isLoading={isLoading} />
      </div>

      {/* Display the prediction result below the form */}
      {(prediction || weatherDetails) && ( // Render if either prediction or details are available
         <PredictionDisplay
            summary={prediction?.summary ?? null}
            locationName={prediction?.locationName ?? weatherDetails?.locationName ?? null} // Prioritize AI's location, fallback to direct fetch
            rainProbability={weatherDetails?.rainProbability}
            windSpeed={weatherDetails?.windSpeed}
            humidity={weatherDetails?.humidity}
         />
      )}

    </main>
  );
}
