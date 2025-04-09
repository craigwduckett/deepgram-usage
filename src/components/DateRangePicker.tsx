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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5 sm:flex-row sm:items-end sm:space-x-6 sm:space-y-0">
      <div className="flex flex-1 flex-col">
        <label htmlFor="start-date" className="mb-2 font-medium text-gray-700">
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="flex flex-1 flex-col">
        <label htmlFor="end-date" className="mb-2 font-medium text-gray-700">
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="flex">
        <Button 
          type="submit" 
          variant="primary"
          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto"
        >
          Get Usage Data
        </Button>
      </div>
    </form>
  );
}