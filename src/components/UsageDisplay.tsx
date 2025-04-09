import React from "react";
import { UsageData } from "../lib/deepgram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { cn } from "../lib/utils";

interface UsageCardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

function UsageCard({ title, value, description, icon, className, trend }: UsageCardProps) {
  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {icon && <div className="h-6 w-6 text-primary">{icon}</div>}
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-2">
        <p className="text-3xl font-bold tracking-tight text-primary-600">{value}</p>
      </CardContent>
      {trend && (
        <CardFooter className="border-t border-muted/20 pt-3">
          <div className={cn(
            "flex items-center text-xs",
            trend.positive ? "text-emerald-600" : "text-rose-600"
          )}>
            {trend.positive ? (
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            ) : (
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            )}
            <span>{trend.value}% {trend.label}</span>
          </div>
        </CardFooter>
      )}
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
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-6">
          <div className="text-center">
            <div className="flex justify-center">
              <svg className="h-8 w-8 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-muted-foreground">Loading usage data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-6">
          <div className="text-center">
            <div className="flex justify-center">
              <svg className="h-10 w-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-destructive">Error loading data</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Usage Data</CardTitle>
          <CardDescription>
            Your Deepgram API usage metrics will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <svg className="mx-auto h-14 w-14 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p className="mt-4 text-muted-foreground">
              Enter your API Key and select a date range to view usage metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate days in range
  const startDate = new Date(usageData.startDate);
  const endDate = new Date(usageData.endDate);
  const daysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate average hours per day
  const averageHours = usageData.hours / daysInRange;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl text-primary-900">Deepgram Usage Metrics</CardTitle>
        <CardDescription>
          <span className="font-medium text-primary-600">{usageData.startDate}</span> to <span className="font-medium text-primary-600">{usageData.endDate}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-4 pt-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UsageCard 
            title="API Requests" 
            value={usageData.requestsCount.toLocaleString()} 
            description="Total number of API calls"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
            } 
          />
          <UsageCard 
            title="Audio Hours" 
            value={usageData.hours.toLocaleString()} 
            description="Total audio processed"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
          />
          <UsageCard 
            title="Daily Average" 
            value={averageHours.toFixed(2)} 
            description={`Hours per day (${daysInRange} days)`}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            }
          />
        </div>

        {/* Usage breakdown section */}
        <div className="mt-8">
          <h3 className="mb-4 text-base font-medium text-foreground">Usage Overview</h3>
          <div className="rounded-lg border bg-card/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-medium">Audio Processing Usage</h4>
              <span className="text-xs text-muted-foreground">
                {Math.round(usageData.hours)} hours total
              </span>
            </div>
            
            {/* Simple progress bar for visualization */}
            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-primary/10">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${Math.min((usageData.hours / 100) * 100, 100)}%` }} 
              />
            </div>
            
            <div className="mt-6 flex flex-col gap-4 text-sm sm:flex-row sm:justify-between">
              <div>
                <p className="text-muted-foreground">API Requests</p>
                <p className="mt-1 text-lg font-medium">{usageData.requestsCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg. per Request</p>
                <p className="mt-1 text-lg font-medium">
                  {(usageData.hours / (usageData.requestsCount || 1)).toFixed(4)} hours
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Period</p>
                <p className="mt-1 text-lg font-medium">{daysInRange} days</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 pt-4 text-xs text-muted-foreground">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p>Powered by Deepgram API</p>
      </CardFooter>
    </Card>
  );
}