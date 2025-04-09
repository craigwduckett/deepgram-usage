import { createClient } from '@deepgram/sdk';

// Create a client instance with your API key
let deepgramClient: ReturnType<typeof createClient> | null = null;
// Get API key from environment variables with fallback to runtime initialization
let apiKey: string | null = import.meta.env.VITE_DEEPGRAM_API_KEY || null;

export interface UsageData {
  requestsCount: number;
  hours: number;
  startDate: string;
  endDate: string;
}

export const initDeepgram = (key: string): void => {
  // Store the API key for proxy requests
  apiKey = key;
  // Still initialize the regular client for any non-browser operations
  deepgramClient = createClient(key);
};

// Try to initialize the client if API key is available from env variables
if (apiKey) {
  deepgramClient = createClient(apiKey);
  console.log('Deepgram client initialized from environment variables');
}

export const getDeepgramUsage = async (startDate: Date, endDate: Date): Promise<UsageData> => {
  if (!apiKey) {
    throw new Error('Deepgram client not initialized. Call initDeepgram first.');
  }

  try {
    // Format dates for API request
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Use our proxy server instead of direct API calls
    
    // First, get the projects
    const projectsResponse = await fetch('/api/deepgram/v1/projects', {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!projectsResponse.ok) {
      throw new Error(`Failed to get projects: ${projectsResponse.statusText}`);
    }

    const projectsData = await projectsResponse.json();
    // Use the first project in the list
    const projectId = projectsData.projects[0].project_id;

    // Now get the usage information
    const usageResponse = await fetch(`/api/deepgram/v1/projects/${projectId}/usage?start=${formattedStartDate}&end=${formattedEndDate}`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!usageResponse.ok) {
      throw new Error(`Deepgram API Error: ${usageResponse.statusText}`);
    }

    const results = await usageResponse.json();

    // Initialize counters
    let requestsCount = 0;
    let hours = 0;
    
    results.results.forEach(({requests, total_hours, }: {requests: number, total_hours: number}) => {
        requestsCount += requests
        hours += total_hours
    });

    console.log(hours)

    return {
      requestsCount,
      hours,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  } catch (error) {
    console.error('Error fetching Deepgram usage:', error);
    throw error;
  }
};