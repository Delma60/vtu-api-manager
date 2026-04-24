import CodeBlock from '@/components/code-block';
import Callout from '@/components/docs-callout';
import DocsParameters from '@/components/docs-parameters';
import { Badge } from '@/components/ui/badge';
import DocsLayout from '@/layouts/docs-layout';

export default function DataPlansDocs() {
    return (
        <DocsLayout currentPath='/docs/data-plans' title="Fetch Data Plans">
            <div className="max-w-4xl">
                <h1 className="mb-4 text-3xl font-bold text-white">Fetch Data Plans</h1>
                <p className="mb-8 text-lg leading-relaxed text-slate-400">
                    Retrieve a real-time list of all active and available data bundles for a specific mobile network. You will need the{' '}
                    <code>id</code> from these results to process a data purchase.
                </p>

                <div className="mb-8 flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <Badge className="border-blue-500/20 bg-blue-500/10 px-3 font-mono text-sm text-blue-500">GET</Badge>
                    <code className="font-mono text-sm break-all text-slate-300">https://api.yourdomain.com/v1/data/plans</code>
                </div>

                <Callout type="info" title="Caching">
                    Data plan pricing and availability can change. We recommend caching this list on your servers for no longer than 24 hours to
                    ensure your application always displays the most accurate pricing to your customers.
                </Callout>

                <h2 className="mt-10 mb-4 border-b border-slate-800 pb-2 text-xl font-semibold text-white">Query Parameters</h2>

                <DocsParameters
                    parameters={[
                        {
                            name: 'network',
                            type: 'string',
                            required: true,
                            description: (
                                <>
                                    <p>Filter the data plans by the mobile network provider.</p>
                                    <p className="mt-2">
                                        Supported values: <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-amber-300">mtn</code>,{' '}
                                        <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-green-400">glo</code>,{' '}
                                        <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-red-400">airtel</code>,{' '}
                                        <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-emerald-400">9mobile</code>.
                                    </p>
                                </>
                            ),
                        },
                    ]}
                />

                <h2 className="mt-10 mb-4 border-b border-slate-800 pb-2 text-xl font-semibold text-white">Example Request</h2>
                <div className="mb-8">
                    <CodeBlock
                        language="bash"
                        title="cURL"
                        code={`curl -X GET "https://api.yourdomain.com/v1/data/plans?network=mtn" \\
  -H "Authorization: Bearer sk_live_your_api_key_here" \\
  -H "Accept: application/json"`}
                    />
                </div>

                <h2 className="mt-10 mb-4 border-b border-slate-800 pb-2 text-xl font-semibold text-white">Response Handling</h2>
                <p className="mb-4 leading-relaxed text-slate-400">
                    A successful request will return a <code>200 OK</code> status code along with an array of available plans. Notice the{' '}
                    <code>id</code> field, which is what you must pass into the Data Purchase endpoint.
                </p>

                <CodeBlock
                    language="json"
                    title="Success Response (200)"
                    code={`{
  "status": true,
  "message": "Data plans retrieved successfully",
  "data": [
    {
      "id": 25,
      "network": "mtn",
      "plan_name": "MTN 1GB (30 Days)",
      "amount": 250,
      "validity": "30 Days"
    },
    {
      "id": 26,
      "network": "mtn",
      "plan_name": "MTN 2GB (30 Days)",
      "amount": 500,
      "validity": "30 Days"
    },
    {
      "id": 27,
      "network": "mtn",
      "plan_name": "MTN 5GB (30 Days)",
      "amount": 1200,
      "validity": "30 Days"
    }
  ]
}`}
                />

                <div className="mt-8">
                    <CodeBlock
                        language="json"
                        title="Validation Error (422)"
                        code={`{
  "status": false,
  "message": "Validation failed.",
  "errors": {
    "network": [
      "The selected network is invalid."
    ]
  }
}`}
                    />
                </div>
            </div>
        </DocsLayout>
    );
}
