import { useEffect, useState } from 'react';
import './App.css';
import { Check, KeyRound } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from './components/DateRangePicker';
import { Footer } from './components/Footer';
import RequestsList from './components/RequestsList';
import { UsageDisplay } from './components/UsageDisplay';
import { Button } from './components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { type UsageData, getDeepgramUsage, initDeepgram } from './lib/deepgram';

// Define the tab types
type TabType = 'usage' | 'requests';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('usage');

  // Store the actual date range for usage tab
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // Default to last 7 days
    to: new Date(), // Today
  });

  // Store the single date for requests tab (defaults to today)
  const [requestsDate, setRequestsDate] = useState<Date>(new Date());

  // Check for API key in environment variables on component mount
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (envApiKey) {
      try {
        initDeepgram(envApiKey);
        setApiKey(envApiKey);
        setIsApiKeySet(true);
        console.log('API key loaded from environment variables');
      } catch (err) {
        setError(
          'Failed to initialize Deepgram client with environment variable'
        );
        console.error(err);
      }
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      try {
        initDeepgram(apiKey);
        setIsApiKeySet(true);
        setError(null);
      } catch (err) {
        setError('Failed to initialize Deepgram client');
        console.error(err);
      }
    }
  };

  const handleDateRangeSubmit = async (startDate: Date, endDate: Date) => {
    if (!isApiKeySet) {
      setError('Please set your API key first');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Update both range and single date
    setDateRange({ from: startDate, to: endDate });
    // When a range is selected in usage tab, use the end date for request details tab
    setRequestsDate(endDate);

    try {
      const data = await getDeepgramUsage(startDate, endDate);
      setUsageData(data);
    } catch (err) {
      setError('Failed to fetch usage data from Deepgram');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection for Requests tab only
  const handleRequestsDateSubmit = (endDate: Date) => {
    // Store the selected date
    setRequestsDate(endDate);

    // If the date is within the date range, don't need to update
    // If outside the range, update the range end date to match
    if (dateRange.from && dateRange.to) {
      const requestDatetime = endDate.getTime();
      if (
        requestDatetime < dateRange.from.getTime() ||
        requestDatetime > dateRange.to.getTime()
      ) {
        // If outside the current range, update the range to include this date
        setDateRange((prev) => ({ ...prev, to: endDate }));
      }
    }
  };

  const resetApiKey = () => {
    setApiKey('');
    setIsApiKeySet(false);
    setUsageData(null);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-6">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold text-gray-800">
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  Deepgram
                </span>{' '}
                Usage Dashboard
              </h1>

              {/* API Key Configuration Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <KeyRound size={16} />
                    {isApiKeySet ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span className="hidden sm:inline">API Key Set</span>
                      </>
                    ) : (
                      <span>Set API Key</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <div className="font-medium">API Key Configuration</div>
                    <p className="text-xs text-muted-foreground">
                      Enter your Deepgram API key to start tracking usage
                      metrics
                    </p>
                    {!isApiKeySet ? (
                      <form
                        onSubmit={handleApiKeySubmit}
                        className="flex flex-col space-y-2"
                      >
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter Deepgram API Key"
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                          required
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
                        >
                          Set API Key
                        </Button>
                      </form>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-green-600 text-sm">
                          <Check className="mr-2 h-4 w-4" />
                          <span>API Key set successfully</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetApiKey}
                        >
                          Reset API Key
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <p className="mt-2 text-lg text-slate-600">
              Track your Deepgram API usage metrics and optimize your
              speech-to-text implementation
            </p>
            <div className="mt-5">
              <a
                href="https://github.com/deepgram/deepgram-js-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30 hover:shadow-md"
              >
                Documentation
              </a>
            </div>
          </div>

          {/* Date range picker that adapts to active tab */}
          <div className="w-full mb-8">
            {isApiKeySet ? (
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'usage'
                      ? 'Select Date Range'
                      : 'Select Date'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeTab === 'usage'
                      ? 'Choose a time period to analyze your Deepgram usage metrics'
                      : 'Choose a date to see request details for a 24-hour period'}
                  </p>

                  {activeTab === 'usage' ? (
                    <DateRangePicker
                      onSubmit={handleDateRangeSubmit}
                      mode="range"
                      buttonText="Get Usage Data"
                      initialDateRange={dateRange}
                    />
                  ) : (
                    <DateRangePicker
                      onSubmit={(startDate, endDate) =>
                        handleRequestsDateSubmit(endDate)
                      }
                      mode="single"
                      buttonText="Get Request Details"
                      initialDate={requestsDate}
                    />
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full">
            {isApiKeySet ? (
              <Tabs
                defaultValue="usage"
                value={activeTab}
                onValueChange={handleTabChange}
                className="mb-6"
              >
                <div className="flex justify-center">
                  <TabsList className="mb-4">
                    <TabsTrigger value="usage">Usage Summary</TabsTrigger>
                    <TabsTrigger value="requests">Request Details</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="usage">
                  <UsageDisplay
                    usageData={usageData}
                    isLoading={isLoading}
                    error={error}
                  />
                </TabsContent>

                <TabsContent value="requests">
                  <RequestsList
                    endDate={requestsDate}
                    onDateRangeChange={handleRequestsDateSubmit}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-medium mb-2">
                  Set your API key to start
                </h3>
                <p className="text-muted-foreground mb-4">
                  Configure your API key to view your Deepgram usage statistics
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
