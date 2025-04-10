import React from "react";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  onSubmit: (startDate: Date, endDate: Date) => void;
  mode?: 'range' | 'single'; // Add mode to support both range and single date
  buttonText?: string;
  initialDateRange?: DateRange; // Add prop for initial date range
  initialDate?: Date; // Add prop for initial single date
}

export function DateRangePicker({ 
  onSubmit, 
  mode = 'range', 
  buttonText = 'Get Usage Data',
  initialDateRange,
  initialDate
}: DateRangePickerProps) {
  // For date range mode - use initialDateRange if provided
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange || {
      from: subDays(new Date(), 7), // Default to last 7 days for usage summary
      to: new Date(), // Today
    }
  );

  // For single date mode - use initialDate if provided
  const [singleDate, setSingleDate] = React.useState<Date>(
    initialDate || new Date()
  );

  // Update state when props change
  React.useEffect(() => {
    if (initialDateRange && mode === 'range') {
      setDateRange(initialDateRange);
    }
  }, [initialDateRange, mode]);

  React.useEffect(() => {
    if (initialDate && mode === 'single') {
      setSingleDate(initialDate);
    }
  }, [initialDate, mode]);

  // Type-safe handlers for calendar selection
  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleSingleSelect = (date: Date | undefined) => {
    if (date) {
      setSingleDate(date);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'range') {
      // Range mode - send both start and end dates
      if (!dateRange?.from || !dateRange?.to) {
        return;
      }

      // Create new Date objects to ensure we're working with fresh instances
      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      
      // Set start date to beginning of day
      startDate.setHours(0, 0, 0, 0);
      
      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);
      
      // Pass the local dates directly without UTC conversion
      onSubmit(startDate, endDate);
    } else {
      // Single date mode - send the end date, and the start date will be computed elsewhere
      if (!singleDate) {
        return;
      }

      // Create a new Date object for the end date
      const endDate = new Date(singleDate);
      
      // Set the end date to the end of the day
      endDate.setHours(23, 59, 59, 999);
      
      // For single date mode, pass the same date for both params
      onSubmit(endDate, endDate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && !singleDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {mode === 'range' ? (
                  dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )
                ) : (
                  singleDate ? (
                    format(singleDate, "MMMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {mode === 'range' ? (
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleRangeSelect}
                  numberOfMonths={2}
                  disabled={(date) => date > new Date()} // Disable future dates
                />
              ) : (
                <Calendar
                  initialFocus
                  mode="single"
                  defaultMonth={singleDate}
                  selected={singleDate}
                  onSelect={handleSingleSelect}
                  numberOfMonths={1}
                  disabled={(date) => date > new Date()} // Disable future dates
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Button 
        type="submit" 
        size="default"
        className="w-full"
      >
        {buttonText}
      </Button>
    </form>
  );
}