import CodeBlock from '@/components/code-block';
import Callout from '@/components/docs-callout';
import DocsComparisonTable from '@/components/docs-comparison-table';
import DocsParameters from '@/components/docs-parameters';
import DocsResponseSchema from '@/components/docs-response-schema';
import DocsSupportedItems from '@/components/docs-supported-items';
import DocsTabs from '@/components/docs-tabs';
import DocsLayout from '@/layouts/docs-layout';

export default function QuickStart() {
    return (
        <DocsLayout title="Quick Start" currentPath="/docs/quick-start">
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">🚀 Quick Start Guide</h1>

            <p className="text-lg text-slate-400">
                Get up and running with the VTU API in just 5 minutes. This guide walks you through the essential steps to make your first API
                request.
            </p>

            <h2>Prerequisites</h2>
            <p>Before you begin, make sure you have:</p>
            <ul>
                <li>A valid account with VTU API Manager</li>
                <li>Your API credentials (API Key)</li>
                <li>Basic understanding of REST APIs</li>
                <li>A tool like cURL, Postman, or a programming language HTTP client</li>
            </ul>

            <Callout type="info" title="API Key">
                Your API key is like your password. Keep it secure and never share it publicly or expose it in client-side code.
            </Callout>

            <h2>Step 1: Set Up Your Authentication</h2>
            <p>
                All requests to the VTU API must include your API key in the <code>Authorization</code> header using the Bearer token format.
            </p>

            <CodeBlock
                language="bash"
                code={`export API_KEY="your_secret_api_key_here"
export BASE_URL="https://api.your-domain.com/api/v1"`}
            />

            <h2>Step 2: Choose Your Environment</h2>
            <p>Select which environment to use for your requests. Start with Sandbox for testing.</p>

            <DocsComparisonTable
                title="Environment Comparison"
                columns={['Sandbox', 'Production']}
                rows={[
                    { feature: 'Real Money', Sandbox: false, Production: true },
                    { feature: 'Test Transactions', Sandbox: true, Production: false },
                    { feature: 'Rate Limits', Sandbox: 'Generous', Production: 'Standard' },
                    { feature: 'Data Retention', Sandbox: '30 days', Production: 'Unlimited' },
                ]}
            />

            <h2>Step 3: Make Your First Request</h2>
            <p>Let's start with a simple operation: buying airtime. Here's how to do it with different tools.</p>

            <DocsTabs
                items={[
                    {
                        label: 'cURL',
                        content: (
                            <CodeBlock
                                language="bash"
                                code={`curl -X POST https://api.your-domain.com/api/v1/airtime \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "network": "MTN",
    "phone": "08012345678",
    "amount": 500
  }'`}
                            />
                        ),
                    },
                    {
                        label: 'Postman',
                        content: (
                            <>
                                <p className="mb-4 text-slate-300">
                                    <strong>Setup in Postman:</strong>
                                </p>
                                <ol className="list-inside list-decimal space-y-2 text-slate-300">
                                    <li>Create a new POST request</li>
                                    <li>
                                        Set URL: <code className="rounded bg-slate-800/50 px-2 py-1">https://api.your-domain.com/api/v1/airtime</code>
                                    </li>
                                    <li>Go to Headers tab</li>
                                    <li>
                                        Add: <code className="rounded bg-slate-800/50 px-2 py-1">Authorization: Bearer YOUR_API_KEY</code>
                                    </li>
                                    <li>Go to Body tab, select Raw/JSON</li>
                                    <li>Paste the JSON payload and click Send</li>
                                </ol>
                            </>
                        ),
                    },
                    {
                        label: 'Python',
                        content: (
                            <CodeBlock
                                language="python"
                                code={`import requests

url = "https://api.your-domain.com/api/v1/airtime"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "network": "MTN",
    "phone": "08012345678",
    "amount": 500
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()

if result['status']:
    print(f"Success: {result['message']}")
    print(f"Reference: {result['data']['reference']}")
else:
    print(f"Error: {result['message']}")`}
                            />
                        ),
                    },
                ]}
            />

            <h2>API Endpoint Parameters</h2>
            <p>When buying airtime, you need to provide the following parameters:</p>

            <DocsParameters
                parameters={[
                    {
                        name: 'network',
                        type: 'string',
                        required: true,
                        description: 'The telecom network provider',
                        example: 'MTN, Airtel, Glo, 9mobile',
                    },
                    {
                        name: 'phone',
                        type: 'string',
                        required: true,
                        description: 'The phone number to recharge (must match network)',
                        example: '08012345678',
                    },
                    {
                        name: 'amount',
                        type: 'number',
                        required: true,
                        description: 'Amount to recharge in Naira',
                        example: '500, 1000, 5000',
                    },
                ]}
            />

            <h2>Response Format</h2>
            <p>
                The API returns a JSON response with a consistent structure. All successful requests will have <code>status: true</code>.
            </p>

            <DocsResponseSchema
                fields={[
                    {
                        name: 'status',
                        type: 'boolean',
                        description: 'Indicates if the transaction was successful',
                    },
                    {
                        name: 'message',
                        type: 'string',
                        description: 'A human-readable message about the transaction',
                    },
                    {
                        name: 'data',
                        type: 'object',
                        description: 'Transaction details',
                        children: [
                            {
                                name: 'reference',
                                type: 'string',
                                description: 'Unique transaction reference ID',
                            },
                            {
                                name: 'network',
                                type: 'string',
                                description: 'The network that was recharged',
                            },
                            {
                                name: 'amount',
                                type: 'number',
                                description: 'The amount charged',
                            },
                            {
                                name: 'balance_after',
                                type: 'number',
                                description: 'Your wallet balance after transaction',
                            },
                        ],
                    },
                ]}
            />

            <h2>Supported Networks</h2>

            <DocsSupportedItems
                title="Available Telecom Networks"
                items={[
                    { label: 'MTN', color: 'blue' },
                    { label: 'Airtel', color: 'green' },
                    { label: 'Globacom', color: 'red' },
                    { label: '9Mobile', color: 'purple' },
                ]}
            />

            <h2>Error Handling</h2>
            <p>
                If something goes wrong, the API will return a response with <code>status: false</code>
                and an error message. Always check the status field.
            </p>

            <Callout type="warning" title="Common Errors">
                <ul className="space-y-1 text-sm">
                    <li>
                        ✗ <strong>INSUFFICIENT_BALANCE</strong> - Wallet balance is too low
                    </li>
                    <li>
                        ✗ <strong>INVALID_NETWORK</strong> - Network parameter is invalid
                    </li>
                    <li>
                        ✗ <strong>INVALID_PHONE</strong> - Phone number format is incorrect
                    </li>
                    <li>
                        ✗ <strong>SERVICE_UNAVAILABLE</strong> - Network provider temporarily unavailable
                    </li>
                </ul>
            </Callout>

            <CodeBlock
                language="json"
                code={`{
  "status": false,
  "message": "Insufficient wallet balance.",
  "error_code": "INSUFFICIENT_BALANCE",
  "data": {
    "required": 500,
    "current_balance": 250
  }
}`}
            />

            <h2>Best Practices</h2>
            <div className="not-prose mt-6 space-y-3">
                {[
                    'Always validate phone numbers before sending requests',
                    'Implement retry logic with exponential backoff for failed requests',
                    'Store the transaction reference for reconciliation',
                    'Never log or store API keys - use environment variables',
                    'Make requests from your backend, never from client-side code',
                    'Implement proper error handling and user feedback',
                ].map((practice, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                        <span className="flex-shrink-0 font-bold text-emerald-400">✓</span>
                        <span className="text-sm text-slate-300">{practice}</span>
                    </div>
                ))}
            </div>

            <Callout type="success" title="You're ready!">
                Congratulations! You now have everything you need to start integrating the VTU API. Check out the endpoint documentation for more
                operations.
            </Callout>
        </DocsLayout>
    );
}
