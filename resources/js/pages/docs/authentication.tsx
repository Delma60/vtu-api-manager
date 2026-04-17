import React from 'react';
import DocsLayout from '@/layouts/docs-layout';
import CodeBlock from '@/components/code-block';
import Callout from '@/components/docs-callout';
import DocsTabs from '@/components/docs-tabs';
import DocsResponseSchema from '@/components/docs-response-schema';
import { Key, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Authentication() {
    return (
        <DocsLayout title="Authentication" currentPath="/docs/authentication">
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                🔐 Authentication
            </h1>

            <p className="text-lg text-slate-400 mb-8">
                The VTU API Manager uses **API Keys** to authenticate requests. You can view and manage your 
                API keys in the Developer Settings of your dashboard.
            </p>

            <Callout type="info" title="Bearer Authentication">
                We use standard HTTP Bearer Authentication. You must include your API key in the <code>Authorization</code> header 
                of every request.
            </Callout>

            {/* OVERVIEW SECTION */}
            <h2 id="how-to-authenticate" className="group relative text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800/50 pb-3 scroll-mt-28">
                <a href="#how-to-authenticate" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                How to Authenticate
            </h2>
            <p className="text-slate-300 mb-4">
                To authenticate an API request, you must provide your API key in the <code>Authorization</code> header. 
                The key must be prefixed with the word <code>Bearer</code> followed by a space.
            </p>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                <p className="text-sm font-mono text-slate-300">
                    <span className="text-indigo-400">Authorization:</span> Bearer <span className="text-emerald-400">sk_test_your_secret_key_here</span>
                </p>
            </div>

            {/* CODE EXAMPLES */}
            <h2 id="code-examples" className="group relative text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800/50 pb-3 scroll-mt-28">
                <a href="#code-examples" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                Code Examples
            </h2>
            <p className="text-slate-300 mb-4">
                Here is how to include your API key in a standard request across different programming languages:
            </p>

            <DocsTabs items={[
                {
                    label: 'cURL',
                    content: (
                        <CodeBlock
                            language="bash"
                            code={`curl -X GET https://api.your-domain.com/api/v1/user \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`}
                        />
                    ),
                },
                {
                    label: 'Node.js (Axios)',
                    content: (
                        <CodeBlock
                            language="javascript"
                            code={`const axios = require('axios');

const response = await axios.get('https://api.your-domain.com/api/v1/user', {
  headers: {
    'Authorization': \`Bearer \${process.env.VTU_API_KEY}\`,
    'Accept': 'application/json'
  }
});`}
                        />
                    ),
                },
                {
                    label: 'Python',
                    content: (
                        <CodeBlock
                            language="python"
                            code={`import requests
import os

headers = {
    "Authorization": f"Bearer {os.getenv('VTU_API_KEY')}",
    "Accept": "application/json"
}

response = requests.get("https://api.your-domain.com/api/v1/user", headers=headers)`}
                        />
                    ),
                },
                {
                    label: 'PHP (cURL)',
                    content: (
                        <CodeBlock
                            language="php"
                            code={`$ch = curl_init('https://api.your-domain.com/api/v1/user');

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . getenv('VTU_API_KEY'),
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);`}
                        />
                    ),
                }
            ]} />

            {/* ENVIRONMENTS */}
            <h2 id="environments" className="group relative text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800/50 pb-3 scroll-mt-28">
                <a href="#environments" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                Environments & Key Types
            </h2>
            <p className="text-slate-300 mb-6">
                Your dashboard provides two types of secret keys. The API will automatically route your request to the correct environment based on the key prefix you use.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        <h3 className="font-semibold text-emerald-400">Sandbox (Test) Keys</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Used for testing. No real money is deducted.</p>
                    <code className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded">Prefix: sk_test_...</code>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Key className="h-5 w-5 text-blue-400" />
                        <h3 className="font-semibold text-blue-400">Production (Live) Keys</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Used for real transactions. Money will be deducted.</p>
                    <code className="text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded">Prefix: sk_live_...</code>
                </div>
            </div>

            {/* SECURITY BEST PRACTICES */}
            <h2 id="security-best-practices" className="group relative text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800/50 pb-3 scroll-mt-28">
                <a href="#security-best-practices" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                Security Best Practices
            </h2>
            
            <Callout type="error" title="Never share your secret keys!">
                Your API keys carry the exact same privileges as your user account. Do not share them, email them, or commit them to public GitHub repositories.
            </Callout>

            <ul className="space-y-3 mt-6 ml-4 list-none text-slate-300">
                <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span><strong>Use Environment Variables:</strong> Always load your API keys securely from `.env` files.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span><strong>Backend Only:</strong> Only make API calls from your secure backend server (PHP, Node.js, Python).</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>No Client-Side Code:</strong> Never embed your API keys in React, Vue, Android, or iOS frontend code. Anyone can extract them.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span><strong>Rotate Compromised Keys:</strong> If you accidentally leak a key, immediately delete it in your developer dashboard and generate a new one.</span>
                </li>
            </ul>

            {/* ERROR HANDLING */}
            <h2 id="authentication-errors" className="group relative text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800/50 pb-3 scroll-mt-28">
                <a href="#authentication-errors" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                Authentication Errors
            </h2>
            <p className="text-slate-300 mb-4">
                If your API key is missing, invalid, or disabled, the API will reject the request and return a <code>401 Unauthorized</code> HTTP status code.
            </p>

            <CodeBlock
                language="json"
                code={`{
  "status": false,
  "message": "Unauthenticated. Invalid or missing API Key.",
  "error_code": "UNAUTHORIZED_ACCESS"
}`}
            />

        </DocsLayout>
    );
}