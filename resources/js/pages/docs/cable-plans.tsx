// resources/js/pages/docs/cable-plans.tsx

import CodeBlock from '@/components/code-block';
import DocsCallout from '@/components/docs-callout';
import DocsParameters from '@/components/docs-parameters';
import { Badge } from '@/components/ui/badge';
import DocsLayout from '@/layouts/docs-layout';
import { Head } from '@inertiajs/react';

export default function CablePlansDocumentation() {
    return (
        <DocsLayout currentPath="/docs/cable-plans" title='Cable TV Plans'>
            <Head title="Cable TV Plans - API Documentation" />

            <div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight">Cable TV Plans</h1>
                <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
                    Retrieve the list of available Cable TV packages (e.g., DSTV, GOTV, Startimes) to display to your users.
                </p>
                <DocsCallout title="Caching Recommended" type="info">
                    Because cable plan prices and IDs rarely change, we strongly recommend caching this API response on your server for at least a few
                    hours to improve your application's speed and reduce unnecessary API calls.
                </DocsCallout>
            </div>

            <div className="mt-12 border-t pt-10">
                <h2 className="mb-4 text-2xl font-bold tracking-tight" id="fetch-cable-plans">
                    Fetch Cable Plans
                </h2>

                <div className="mb-6 flex items-center gap-3">
                    <Badge variant="default" className="bg-blue-500 text-white hover:bg-blue-600">
                        GET
                    </Badge>
                    <code className="bg-muted rounded px-2 py-1 font-mono text-sm">/api/v1/cable-plans</code>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Query Parameters</h3>
                        <DocsParameters
                            parameters={[
                                {
                                    name: 'provider',
                                    type: 'string',
                                    required: false,
                                    description: 'Filter plans by provider (e.g., DSTV, GOTV). If omitted, returns all providers.',
                                },
                            ]}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Example Request</h3>
                            <CodeBlock
                                language="bash"
                                code={`curl -X GET "https://yourdomain.com/api/v1/cable-plans?provider=DSTV" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                            />
                        </div>
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Example Response</h3>
                            <CodeBlock
                                language="json"
                                code={`{
  "status": "success",
  "data": [
    {
      "id": 10,
      "provider": "DSTV",
      "plan_id": "dstv-yanga",
      "name": "DStv Yanga Bouquet",
      "amount": 4200
    },
    {
      "id": 11,
      "provider": "DSTV",
      "plan_id": "dstv-confam",
      "name": "DStv Confam Bouquet",
      "amount": 7400
    }
  ]
}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DocsLayout>
    );
}
