import React, { useState } from "react";
import { Button } from "./ui/button";

interface DateRangePickerProps {
  onSubmit: (startDate: Date, endDate: Date) => void;
}

export function DateRangePicker({ onSubmit }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(new Date(startDate), new Date(endDate));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="mb-1.5 text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="end-date" className="mb-1.5 text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        variant="outline"
        size="default"
        className="w-full"
      >
        Get Usage Data
      </Button>
    </form>
  );
}