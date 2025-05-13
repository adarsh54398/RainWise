"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WeatherFormSchema, type WeatherFormValues } from "@/lib/schema";

interface WeatherFormProps {
  onSubmit: (values: WeatherFormValues) => Promise<void>;
  isLoading: boolean;
}

export function WeatherForm({ onSubmit, isLoading }: WeatherFormProps) {
  const form = useForm<WeatherFormValues>({
    resolver: zodResolver(WeatherFormSchema),
    defaultValues: {
      locationName: "",
    },
  });

  const handleSubmit = async (values: WeatherFormValues) => {
    await onSubmit(values);
    // Optionally reset form after submission if needed
    // form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="locationName" // Changed from pincode
          render={({ field }) => (
            <FormItem>
              <FormLabel>City / District Name (India)</FormLabel> {/* Updated label */}
              <FormControl>
                <Input
                  placeholder="Enter city or district name" // Updated placeholder
                  type="text" // Changed type
                  autoComplete="address-level2" // Set appropriate autocomplete
                  {...field}
                  className="max-w-xs" // Limit width for better visual
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Prediction...
            </>
          ) : (
            "Get Rain Prediction"
          )}
        </Button>
      </form>
    </Form>
  );
}
