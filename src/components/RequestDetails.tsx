import React from "react";
import { RequestData } from "../lib/deepgram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

interface RequestDetailsProps {
  request: RequestData;
  onBack: () => void;
}

export default function RequestDetails({ request, onBack }: RequestDetailsProps) {
  // Format the response JSON for display
  const formattedResponse = JSON.stringify(request.response, null, 2);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-primary-900">Request Details</CardTitle>
            <CardDescription>
              {request.request_id}
            </CardDescription>
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
                  <dt className="font-medium text-muted-foreground">Created:</dt>
                  <dd className="col-span-2">{new Date(request.created).toLocaleString()}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">Path:</dt>
                  <dd className="col-span-2">{request.path}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">Status Code:</dt>
                  <dd className="col-span-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      request.code >= 200 && request.code < 300 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.code}
                    </span>
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">API Key ID:</dt>
                  <dd className="col-span-2">{request.api_key_id}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <dt className="font-medium text-muted-foreground">Deployment:</dt>
                  <dd className="col-span-2">{request.deployment || 'N/A'}</dd>
                </div>
                {request.callback && (
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-muted-foreground">Callback:</dt>
                    <dd className="col-span-2">{request.callback}</dd>
                  </div>
                )}
              </dl>
            </div>
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