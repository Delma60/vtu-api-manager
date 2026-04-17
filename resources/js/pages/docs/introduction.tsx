import ApiEndpoint from '@/components/api-endpoint';
import CodeBlock from '@/components/code-block';
import Callout from '@/components/docs-callout';
import DocsTabs from '@/components/docs-tabs';
import DocsLayout from '@/layouts/docs-layout';
import { usePage } from '@inertiajs/react';
import { Lightbulb, Smartphone, Tv, Wifi } from 'lucide-react';

export default function Introduction() {
    const { props } = usePage<any>();

    const baseUrl = props.app_url || (typeof window !== 'undefined' ? window.location.origin : 'https://api.your-domain.com');
    const apiUrl = `${baseUrl}/api/v1`;
    
    // Optional: Auto-generate sandbox URL (or just keep it fixed if your sandbox is on a completely different domain)
    const sandboxUrl = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
        ? `${baseUrl}/sandbox/api/v1` 
        : baseUrl.replace('://', '://sandbox.') + '/api/v1';
    return (
        <DocsLayout title="Introduction" currentPath="/docs/introduction">
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">🎯 Welcome to VTU API Manager</h1>

            <p className="lead text-lg text-slate-400">
                A unified, developer-first REST API to programmatically integrate digital utility payments directly into your financial applications,
                wallets, or reward systems.
            </p>

            <Callout type="info" title="API Documentation">
                This documentation includes interactive examples, code snippets, and API endpoints. Use the sidebar to navigate through different
                sections.
            </Callout>

            <h2 id="core-capabilities" className="scroll-mt-28">
                ✨ Core Capabilities
            </h2>
            <p>Integrate once and instantly gain access to a comprehensive suite of bill payment services across Nigeria and beyond.</p>

            {/* Modern Feature Grid */}
            <div className="not-prose my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                    {
                        title: 'Airtime Top-up',
                        desc: 'Instant recharge across all major networks.',
                        icon: Smartphone,
                        color: 'text-blue-400',
                        bg: 'bg-blue-400/10',
                        border: 'border-blue-500/20',
                    },
                    {
                        title: 'Data Bundles',
                        desc: 'SME, CG, and Direct Data provisioning.',
                        icon: Wifi,
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-400/10',
                        border: 'border-emerald-500/20',
                    },
                    {
                        title: 'Cable TV',
                        desc: 'DSTV, GOTV, and Startimes renewals.',
                        icon: Tv,
                        color: 'text-amber-400',
                        bg: 'bg-amber-400/10',
                        border: 'border-amber-500/20',
                    },
                    {
                        title: 'Utility Bills',
                        desc: 'Electricity token generation nationwide.',
                        icon: Lightbulb,
                        color: 'text-purple-400',
                        bg: 'bg-purple-400/10',
                        border: 'border-purple-500/20',
                    },
                ].map((feature, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-4 rounded-xl border ${feature.border} ${feature.bg} p-5 transition-all duration-300 hover:shadow-lg hover:shadow-${feature.color.split('-')[1]}-500/10 hover:border-opacity-50`}
                    >
                        <div className={`rounded-lg p-3 ${feature.bg} flex-shrink-0`}>
                            <feature.icon className={`h-5 w-5 ${feature.color}`} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">{feature.title}</h4>
                            <p className="mt-1 text-sm text-slate-400">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Callout type="tip" title="Quick Integration">
                Most developers integrate the API in under 30 minutes. Start with the authentication section to get your API credentials.
            </Callout>

            <h2>🌍 Base Environments</h2>
            <p>
                Test your integration risk-free in the Sandbox environment before going live. All endpoints are identical across both environments for
                consistent development experience.
            </p>

            {/* Environment Endpoints */}
            <div className="not-prose my-6 space-y-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="mb-2 text-xs font-semibold text-emerald-400">SANDBOX (Testing)</p>
                    <ApiEndpoint method="POST" endpoint={sandboxUrl} />
                </div>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                    <p className="mb-2 text-xs font-semibold text-blue-400">PRODUCTION (Live)</p>
                    <ApiEndpoint method="POST" endpoint={apiUrl} />
                </div>
            </div>

            <h2>🔐 Authentication</h2>
            <p>
                All API requests require a <strong>Bearer Token</strong>. Retrieve your secret API keys from the Developer Settings dashboard. Never
                expose your API keys in client-side code.
            </p>

            <DocsTabs
                items={[
                    {
                        label: 'cURL',
                        content: (
                            <CodeBlock
                                language="bash"
                                code={`curl -X POST ${apiUrl}/airtime \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY" \\
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
                        label: 'Python',
                        content: (
                            <CodeBlock
                                language="python"
                                code={`import requests

headers = {
    "Authorization": "Bearer YOUR_SECRET_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "network": "MTN",
    "phone": "08012345678",
    "amount": 500
}

response = requests.post(
    "${apiUrl}/airtime",
    headers=headers,
    json=data
)`}
                            />
                        ),
                    },
                    {
                        label: 'JavaScript',
                        content: (
                            <CodeBlock
                                language="javascript"
                                code={`const response = await fetch('${apiUrl}/airtime', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_SECRET_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        network: 'MTN',
        phone: '08012345678',
        amount: 500
    })
});

const result = await response.json();
console.log(result);`}
                            />
                        ),
                    },
                    {
                        label: 'PHP',
                        content: (
                            <CodeBlock
                                language="php"
                                code={`$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${apiUrl}/airtime");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_SECRET_API_KEY",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "network" => "MTN",
    "phone" => "08012345678",
    "amount" => 500
]));

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);`}
                            />
                        ),
                    },
                ]}
            />

            <h2>📦 Standard Response Format</h2>
            <p>
                Every API endpoint returns a predictable JSON response structure, making it easy to parse responses and handle errors consistently
                across your application.
            </p>

            <DocsTabs
                items={[
                    {
                        label: 'Success Response',
                        content: (
                            <CodeBlock
                                language="json"
                                code={`{
  "status": true,
  "message": "Transaction processed successfully.",
  "data": {
    "reference": "VTU-TXN-987654321",
    "network": "MTN",
    "amount": 500,
    "balance_after": 14500.50,
    "timestamp": "2024-04-17T10:30:00Z"
  }
}`}
                            />
                        ),
                    },
                    {
                        label: 'Error Response',
                        content: (
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
                        ),
                    },
                ]}
            />

            <Callout type="warning" title="Error Handling">
                Always check the <code>status</code> field to determine if a request was successful. Implement proper error handling for{' '}
                <code>INSUFFICIENT_BALANCE</code>,<code>NETWORK_ERROR</code>, and <code>SERVICE_UNAVAILABLE</code> scenarios.
            </Callout>

            <h2>🚀 Getting Started</h2>
            <p>Follow these steps to start integrating with the VTU API Manager:</p>

            <div className="not-prose my-6 space-y-3">
                {[
                    { num: 1, title: 'Get Your API Keys', desc: 'Visit the Developer Dashboard to create an API key' },
                    { num: 2, title: 'Choose Your Environment', desc: 'Start with Sandbox for testing, then move to Production' },
                    { num: 3, title: 'Authenticate Your Requests', desc: 'Include your Bearer token in request headers' },
                    { num: 4, title: 'Make Your First Request', desc: 'Follow the endpoint documentation to make a successful request' },
                    { num: 5, title: 'Monitor Transactions', desc: 'Track transaction status and handle responses appropriately' },
                ].map((step, i) => (
                    <div
                        key={i}
                        className="flex gap-4 rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 transition-colors hover:bg-slate-900/50"
                    >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/20">
                            <span className="text-sm font-bold text-indigo-300">{step.num}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-white">{step.title}</p>
                            <p className="text-sm text-slate-400">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2>📞 Support & Resources</h2>
            <p>Need help? We've got you covered:</p>

            <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                    href="#"
                    className="group rounded-lg border border-slate-800/50 bg-slate-900/50 p-4 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
                >
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-indigo-300">📧 Email Support</p>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">Get responses within 24 hours</p>
                </a>
                <a
                    href="#"
                    className="group rounded-lg border border-slate-800/50 bg-slate-900/50 p-4 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
                >
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-indigo-300">💬 Community Chat</p>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">Join our Slack community</p>
                </a>
                <a
                    href="#"
                    className="group rounded-lg border border-slate-800/50 bg-slate-900/50 p-4 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
                >
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-indigo-300">📚 Knowledge Base</p>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">Browse common questions</p>
                </a>
                <a
                    href="#"
                    className="group rounded-lg border border-slate-800/50 bg-slate-900/50 p-4 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
                >
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-indigo-300">🐛 Report Issues</p>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">Found a bug? Let us know</p>
                </a>
            </div>

            <Callout type="success" title="Ready to build?">
                Head over to the Authentication section to learn how to secure your API requests and start building amazing features!
            </Callout>
        </DocsLayout>
    );
}
