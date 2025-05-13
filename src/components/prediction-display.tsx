import * as React from "react";
import { CloudRain, Sun, Wind, Droplets, MapPin } from "lucide-react"; // Added MapPin
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PredictionDisplayProps {
  summary: string | null;
  locationName: string | null; // Added locationName prop
  rainProbability?: number;
  windSpeed?: number;
  humidity?: number;
}

// Helper to get icon based on rain probability
const getWeatherIcon = (rainProbability: number | undefined) => {
  if (rainProbability === undefined) return <Sun className="h-6 w-6 text-yellow-500" />; // Smaller icon
  if (rainProbability > 60) return <CloudRain className="h-6 w-6 text-blue-500" />;
  if (rainProbability > 30) return <CloudRain className="h-6 w-6 text-gray-500 opacity-70" />; // Light rain/cloudy
  return <Sun className="h-6 w-6 text-yellow-500" />;
};

export function PredictionDisplay({ summary, locationName, rainProbability, windSpeed, humidity }: PredictionDisplayProps) {
  // Render only if we have at least a summary or location name
  if (!summary && !locationName) {
    return null;
  }

  const icon = getWeatherIcon(rainProbability);

  return (
    <Card className="w-full max-w-md shadow-md rounded-lg mt-8">
      <CardHeader className="pb-2">
         <div className="flex items-center justify-between space-x-2">
            <CardTitle className="text-lg font-semibold">
              Weather Prediction {locationName ? `for ${locationName}` : ''}
            </CardTitle>
            {icon}
        </div>
        {locationName && (
            <div className="flex items-center text-sm text-muted-foreground pt-1">
                 <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                 <span>{locationName}</span>
            </div>
        )}
      </CardHeader>
      <CardContent>
        {summary && <p className="text-sm text-muted-foreground mb-4">{summary}</p>}
        { (rainProbability !== undefined || windSpeed !== undefined || humidity !== undefined) && <Separator className="my-4" /> }
        <div className="grid grid-cols-3 gap-4 text-center">
          {rainProbability !== undefined && (
            <div className="flex flex-col items-center">
              <CloudRain className="h-5 w-5 mb-1 text-blue-500" />
              <p className="text-xs text-muted-foreground">Rain Chance</p>
              <p className="text-lg font-bold">{rainProbability}%</p>
            </div>
          )}
           {windSpeed !== undefined && (
            <div className="flex flex-col items-center">
                <Wind className="h-5 w-5 mb-1 text-gray-600" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="text-lg font-bold">{windSpeed} mph</p>
            </div>
            )}
          {humidity !== undefined && (
            <div className="flex flex-col items-center">
              <Droplets className="h-5 w-5 mb-1 text-teal-500" />
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-lg font-bold">{humidity}%</p>
            </div>
          )}
        </div>
         {/* Render placeholder if no specific data points are available but summary/location exists */}
         {summary && rainProbability === undefined && windSpeed === undefined && humidity === undefined && (
             <p className="text-center text-sm text-muted-foreground mt-4">Detailed metrics unavailable.</p>
         )}
      </CardContent>
    </Card>
  );
}
