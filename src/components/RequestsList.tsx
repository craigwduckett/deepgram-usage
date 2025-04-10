import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type RequestData,
  type RequestsListResponse,
  getDeepgramRequests,
} from '../lib/deepgram';
import { formatApiPath } from '../lib/utils';
import RequestDetails from './RequestDetails.tsx';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface RequestsListProps {
  // Only use endDate for requests list
  endDate: Date;
  onDateRangeChange?: (endDate: Date) => void;
}

export default function RequestsList({
  endDate,
  onDateRangeChange,
}: RequestsListProps) {
  const [requestsData, setRequestsData] = useState<RequestsListResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // Start at page 0
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const pageLimit = 100; // Fixed page limit of 100

  const loadRequests = useCallback(
    async (page = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        // For requests, we only use endDate and calculate startDate as 24 hours before
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 1); // Go back 1 day from end date

        // API requests will use ISO format dates (handled by deepgram.ts)
        const data = await getDeepgramRequests(endDate, page, pageLimit);

        // Sort requests by created date in descending order (newest first)
        const sortedRequests = [...data.requests].sort((a, b) => {
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        });

        setRequestsData({
          ...data,
          requests: sortedRequests,
        });
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [endDate]
  );

  // Handle going to newer page (page - 1, can't go below 0)
  const handleNewerPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      loadRequests(newPage);
    }
  };

  // Handle going to older page (page + 1)
  const handleOlderPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    loadRequests(newPage);
  };

  useEffect(() => {
    // Reset to page 0 when endDate changes
    setCurrentPage(0);
    loadRequests(0);

    // If we're displaying details for a request, go back to the list view
    // when the date changes to ensure consistent behavior
    if (selectedRequest) {
      setSelectedRequest(null);
    }
  }, [loadRequests, selectedRequest]);

  const handleRequestClick = useCallback((request: RequestData) => {
    setSelectedRequest(request);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  // Define table columns with useMemo to avoid recreating on every render
  const columns = useMemo<ColumnDef<RequestData>[]>(
    () => [
      {
        accessorKey: 'created',
        header: 'Created',
        cell: ({ row }) => {
          const created: string = row.getValue('created');
          const date = new Date(created);

          // Display in local time format
          return (
            <div
              title={`UTC: ${date.toISOString().replace('T', ' ').substring(0, 19)} UTC`}
            >
              {date.toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: 'path',
        header: 'Path',
        cell: ({ row }) => {
          const path: string = row.getValue('path');
          const { displayPath, tooltip } = formatApiPath(path);
          return (
            <div className="max-w-[200px] truncate" title={tooltip}>
              {displayPath}
            </div>
          );
        },
      },
      {
        accessorKey: 'code',
        header: 'Status',
        cell: ({ row }) => {
          const requestData = row.original;
          const statusCode = requestData.response?.code || requestData.code;

          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                statusCode === 200
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {String(statusCode)}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRequestClick(row.original)}
            >
              View Details
            </Button>
          );
        },
      },
    ],
    [handleRequestClick]
  );

  // Always call useReactTable hook, but with empty data if needed
  const table = useReactTable({
    data: requestsData?.requests || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (selectedRequest) {
    return (
      <RequestDetails request={selectedRequest} onBack={handleBackToList} />
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-6">
          <div className="text-center">
            <div className="flex justify-center">
              <svg
                className="h-8 w-8 animate-spin text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="false"
                role="img"
              >
                <title>Loading spinner</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="mt-4 text-muted-foreground">
              Loading requests data...
            </p>
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
              <svg
                className="h-10 w-10 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="false"
                role="img"
              >
                <title>Error icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-destructive">
              Error loading data
            </p>
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
            <svg
              className="mx-auto h-14 w-14 text-muted-foreground/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="false"
              role="img"
            >
              <title>No requests icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
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
        <CardTitle className="text-xl text-primary-900">
          Deepgram Requests
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div>
            Showing requests for {endDate.toLocaleDateString()} (24-hour period)
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-4 pt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {requestsData.requests.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* API-based Pagination */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewerPage}
            disabled={currentPage === 0} // Disable if on first page
          >
            Newer
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleOlderPage}
            disabled={requestsData.requests.length < pageLimit} // Disable if current page has fewer items than limit
          >
            Older
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 pt-4 text-xs text-muted-foreground">
        <p>
          Showing {requestsData.requests.length} requests (max 100 per page)
        </p>
      </CardFooter>
    </Card>
  );
}
