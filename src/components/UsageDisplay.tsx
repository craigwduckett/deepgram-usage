import React from "react";
import { UsageData } from "../lib/deepgram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";

interface UsageCardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
}

function UsageCard({ title, value, description, icon }: UsageCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-primary-50 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900">{title}</CardTitle>
          <div className="flex-shrink-0">{icon}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-3xl font-bold text-primary-600">{value}</p>
      </CardContent>
    </Card>
  );
}

interface UsageDisplayProps {
  usageData: UsageData | null;
  isLoading: boolean;
  error: string | null;
}

export function UsageDisplay({ usageData, isLoading, error }: UsageDisplayProps) {
  if (isLoading) {
    return (
      <div className="mt-8 rounded-lg bg-white p-6 text-center shadow-sm">
        <div className="flex justify-center">
          <svg className="h-5 w-5 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="mt-3 text-slate-600">Loading usage data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-lg bg-destructive/10 p-6 text-center shadow-sm">
        <div className="flex justify-center">
          <svg className="h-4 w-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p className="mt-2 text-destructive">Error: {error}</p>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className="mt-8 rounded-lg bg-white p-6 text-center shadow-sm">
        <div className="flex justify-center">
          <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p className="mt-3 text-slate-600">
          Enter your API Key and select a date range to view Deepgram usage.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Usage from <span className="text-primary">{usageData.startDate}</span> to <span className="text-primary">{usageData.endDate}</span>
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <UsageCard 
          title="API Requests" 
          value={usageData.requestsCount.toLocaleString()} 
          description="Total number of API requests"
          icon={
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
          } 
        />
        <UsageCard 
          title="Audio Hours" 
          value={usageData.hours.toLocaleString()} 
          description="Total audio hours processed"
          icon={
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
      </div>
    </div>
  );
}