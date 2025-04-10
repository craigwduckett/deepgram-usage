import type { RequestData } from '../lib/deepgram';
import { formatApiPath } from '../lib/utils';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

interface RequestDetailsProps {
  request: RequestData;
  onBack: () => void;
}

interface ParsedPath {
  basePath: string;
  segments: string[];
  queryParams: Record<string, string>;
}

// Parse a URL path into segments and query parameters
function parsePathComponents(path: string): ParsedPath {
  // Split path and query parameters
  const [pathPart, queryPart] = path.split('?');

  // Parse path segments
  const segments = pathPart.split('/').filter(Boolean);

  // Parse query parameters
  const queryParams: Record<string, string> = {};
  if (queryPart) {
    for (const param of queryPart.split('&')) {
      const [key, value] = param.split('=');
      if (key) {
        // If this parameter already exists, append the new value with a comma
        if (queryParams[key]) {
          queryParams[key] += `, ${decodeURIComponent(value || '')}`;
        } else {
          queryParams[key] = decodeURIComponent(value || '');
        }
      }
    }
  }

  return {
    basePath: pathPart,
    segments,
    queryParams,
  };
}

export default function RequestDetails({
  request,
  onBack,
}: RequestDetailsProps) {
  // Format the response JSON for display
  const formattedResponse = JSON.stringify(request.response, null, 2);

  // Parse the path into components
  const parsedPath = parsePathComponents(request.path);

  // Check if we have path segments or query parameters to display
  const hasPathComponents =
    parsedPath.segments.length > 0 ||
    Object.keys(parsedPath.queryParams).length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-primary-900">
              Request Details
            </CardTitle>
            <CardDescription>{request.request_id}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            Back to List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-4 pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Request Information</h3>
            <div className="rounded-lg border bg-card p-4">
              <dl className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">
                    Created:
                  </dt>
                  <dd className="col-span-2">
                    {new Date(request.created).toLocaleString()}
                    <span className="ml-2 text-xs text-muted-foreground">
                      (
                      {new Date(request.created)
                        .toISOString()
                        .replace('T', ' ')
                        .substring(0, 19)}{' '}
                      UTC)
                    </span>
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">Path:</dt>
                  <dd className="col-span-2" title={request.path}>
                    {formatApiPath(request.path).displayPath}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">
                    Status Code:
                  </dt>
                  <dd className="col-span-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        (request.response?.code || request.code) === 200
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {(request.response?.code || request.code)?.toString()}
                    </span>
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">
                    API Key ID:
                  </dt>
                  <dd className="col-span-2">{request.api_key_id}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">
                    Deployment:
                  </dt>
                  <dd className="col-span-2">{request.deployment || 'N/A'}</dd>
                </div>
                {request.callback && (
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-muted-foreground">
                      Callback:
                    </dt>
                    <dd className="col-span-2">{request.callback}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Path Components Section */}
            {hasPathComponents && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-medium">Path Components</h3>
                <div className="rounded-lg border bg-card p-4">
                  {parsedPath.segments.length > 0 && (
                    <>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">
                        Path Segments:
                      </h4>
                      <ul className="mb-3 space-y-1">
                        {parsedPath.segments.map((segment) => (
                          <li
                            key={`segment-${segment}`}
                            className="text-xs bg-muted rounded px-2 py-1 break-all"
                          >
                            <span className="font-mono">
                              {parsedPath.segments.indexOf(segment) + 1}:
                            </span>{' '}
                            {segment}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {Object.keys(parsedPath.queryParams).length > 0 && (
                    <>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">
                        Query Parameters:
                      </h4>
                      <dl className="space-y-1">
                        {Object.entries(parsedPath.queryParams).map(
                          ([key, value]) => (
                            <div
                              key={`param-${key}`}
                              className="grid grid-cols-3 gap-1 text-xs"
                            >
                              <dt className="font-mono break-all">{key}:</dt>
                              <dd className="col-span-2 bg-muted rounded px-2 py-1 break-all">
                                {decodeURIComponent(value || '')}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Response Data</h3>
            <div className="max-h-[400px] overflow-auto rounded-lg border bg-card p-4">
              <pre className="text-xs">{formattedResponse}</pre>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 pt-4 text-xs text-muted-foreground">
        <p>Request ID: {request.request_id}</p>
      </CardFooter>
    </Card>
  );
}
