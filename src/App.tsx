import { useState, useEffect } from 'react';
import './App.css';
import { DateRangePicker } from './components/DateRangePicker';
import { Footer } from './components/Footer';
import { NavBar } from './components/NavBar';
import { UsageDisplay } from './components/UsageDisplay';
import RequestsList from './components/RequestsList';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { UsageData, getDeepgramUsage, initDeepgram } from './lib/deepgram';

// Define the tab types
type TabType = 'usage' | 'requests';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('usage');
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>(null);

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
        setError('Failed to initialize Deepgram client with environment variable');
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
    setDateRange({ startDate, endDate });

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

  const resetApiKey = () => {
    setApiKey('');
    setIsApiKeySet(false);
    setUsageData(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Deepgram</span> Usage Dashboard
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Track your Deepgram API usage metrics and optimize your speech-to-text implementation
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Left Column - Configuration (25% width) */}
            <div className="lg:w-1/4 space-y-8 mb-8 lg:mb-0">
              <Card className="overflow-hidden shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">API Key Configuration</CardTitle>
                  <CardDescription>
                    Enter your Deepgram API key to start tracking usage metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isApiKeySet ? (
                    <form onSubmit={handleApiKeySubmit} className="flex flex-col space-y-4">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter Deepgram API Key"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                      />
                      <Button 
                        type="submit" 
                        className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 font-medium text-white shadow-md transition-all hover:shadow-lg"
                      >
                        Set API Key
                      </Button>
                    </form>
                  ) : (
                    <div className="flex flex-col items-start space-y-4">
                      <span className="flex items-center text-green-600">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="mr-2 h-6 w-6" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <span className="text-lg font-medium">API Key set successfully</span>
                      </span>
                      <Button 
                        variant="outline"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                        onClick={resetApiKey}
                      >
                        Reset API Key
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hiddenshadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Date Range</CardTitle>
                  <CardDescription>
                    Select the time period for usage data analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DateRangePicker onSubmit={handleDateRangeSubmit} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Data Display (75% width) */}
            <div className="lg:w-3/4">
              {isApiKeySet && dateRange ? (
                <Tabs 
                  defaultValue="usage" 
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as TabType)}
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
                    {dateRange && (
                      <RequestsList 
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <UsageDisplay 
                  usageData={usageData}
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
