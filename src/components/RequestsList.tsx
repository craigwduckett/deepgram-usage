import { useState, useEffect } from "react";
import { RequestData, RequestsListResponse, getDeepgramRequests } from "../lib/deepgram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import RequestDetails from "./RequestDetails.tsx";

interface RequestsListProps {
  startDate: Date;
  endDate: Date;
}

export default function RequestsList({ startDate, endDate }: RequestsListProps) {
  const [requestsData, setRequestsData] = useState<RequestsListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  
  const loadRequests = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getDeepgramRequests(startDate, endDate, page, 10);
      setRequestsData(data);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadRequests(1);
  }, [startDate, endDate]);
  
  const handleRequestClick = (request: RequestData) => {
    setSelectedRequest(request);
  };
  
  const handleBackToList = () => {
    setSelectedRequest(null);
  };
  
  const handlePageChange = (page: number) => {
    loadRequests(page);
  };
  
  if (selectedRequest) {
    return <RequestDetails request={selectedRequest} onBack={handleBackToList} />;
  }
  
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
            <p className="mt-4 text-muted-foreground">Loading requests data...</p>
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
  
  if (!requestsData || requestsData.requests.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Request Data</CardTitle>
          <CardDescription>
            No requests found for the selected date range
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <svg className="mx-auto h-14 w-14 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="mt-4 text-muted-foreground">
              Try adjusting your date range to see more requests.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl text-primary-900">Deepgram Requests</CardTitle>
        <CardDescription>
          <span className="font-medium text-primary-600">{startDate.toISOString().split('T')[0]}</span> to <span className="font-medium text-primary-600">{endDate.toISOString().split('T')[0]}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-4 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                <th className="pb-2 pt-3">Request ID</th>
                <th className="pb-2 pt-3">Created</th>
                <th className="pb-2 pt-3">Path</th>
                <th className="pb-2 pt-3">Status</th>
                <th className="pb-2 pt-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requestsData.requests.map((request) => (
                <tr 
                  key={request.request_id} 
                  className="border-b hover:bg-muted/50"
                >
                  <td className="py-3 text-sm">{request.request_id.substring(0, 12)}...</td>
                  <td className="py-3 text-sm">{new Date(request.created).toLocaleString()}</td>
                  <td className="py-3 text-sm">{request.path}</td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      request.code >= 200 && request.code < 300 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.code}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRequestClick(request)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={requestsData.requests.length < requestsData.limit}
          >
            Next
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 pt-4 text-xs text-muted-foreground">
        <p>Showing {requestsData.requests.length} of {requestsData.requests.length} requests</p>
      </CardFooter>
    </Card>
  );
}