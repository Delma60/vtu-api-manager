import React from 'react';
import DocsLayout from '@/layouts/docs-layout';
import Callout from '@/components/docs-callout';
import { Copy, EyeOff, KeyRound, RefreshCcw, ShieldCheck } from 'lucide-react';

export default function ApiKeysDocs() {
    return (
        <DocsLayout title="API Keys" currentPath="/docs/api-keys">
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                🔑 API Keys
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
                Your API keys are the master passwords for your VTU API Manager integration. 
                This guide explains how to locate, rotate, and secure your keys.
            </p>

            {/* RETRIEVING KEYS */}
            <h2 id="locating-your-keys" className="group relative text-2xl font-bold text-foreground mt-12 mb-4 border-b border-border pb-3 scroll-mt-28">
                <a href="#locating-your-keys" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity">#</a>
                Locating Your Keys
            </h2>
            <p className="text-muted-foreground mb-6">
                You can find your API keys in the Developer Dashboard. We provide separate keys for your Sandbox (testing) and Production (live) environments.
            </p>

            {/* UI Mockup of the Dashboard */}
            <div className="my-8 rounded-xl border border-border bg-card shadow-lg overflow-hidden text-card-foreground">
                <div className="border-b border-border bg-muted/50 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-2">Developer Settings / API Keys</span>
                </div>
                <div className="p-6 space-y-6">
                    {/* Sandbox Key Mockup */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-semibold">Sandbox Secret Key</span>
                            </div>
                            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded inline-block mt-1">
                                sk_test_8f92***************************
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"><EyeOff className="w-4 h-4" /></button>
                            <button className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Copy className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Live Key Mockup */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold">Production Secret Key</span>
                            </div>
                            <div className="text-xs font-mono text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2 py-1 rounded inline-block mt-1">
                                sk_live_3c14***************************
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"><EyeOff className="w-4 h-4" /></button>
                            <button className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Copy className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <Callout type="tip" title="Hidden by default">
                For your security, Secret Keys are partially hidden by default. You will need to click the "Reveal" (eye) icon and authenticate with your account password to copy the full key.
            </Callout>

            {/* KEY ROTATION */}
            <h2 id="rolling-keys" className="group relative text-2xl font-bold text-foreground mt-12 mb-4 border-b border-border pb-3 scroll-mt-28">
                <a href="#rolling-keys" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity">#</a>
                Rolling Your Keys
            </h2>
            <p className="text-muted-foreground mb-4">
                If you suspect that an API key has been compromised (e.g., accidentally committed to GitHub or shared in a public forum), you must <strong>roll (regenerate)</strong> it immediately.
            </p>

            <div className="flex gap-4 items-start bg-amber-500/10 border border-amber-500/20 rounded-lg p-5 my-6">
                <RefreshCcw className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-amber-700 dark:text-amber-400 font-semibold mb-1">What happens when you roll a key?</h4>
                    <p className="text-sm text-muted-foreground">
                        1. A brand new API key is instantly generated for you.<br/>
                        2. The old API key is permanently invalidated.<br/>
                        3. Any API requests currently using the old key will begin failing with a <code>401 Unauthorized</code> error immediately.
                    </p>
                </div>
            </div>

            {/* WEBHOOK SECRETS */}
            <h2 id="webhook-secrets" className="group relative text-2xl font-bold text-foreground mt-12 mb-4 border-b border-border pb-3 scroll-mt-28">
                <a href="#webhook-secrets" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity">#</a>
                Webhook Secrets
            </h2>
            <p className="text-muted-foreground mb-4">
                Alongside API keys, your dashboard also provides a <strong>Webhook Secret</strong>. While API keys are used by <em>you</em> to authenticate requests sent to <em>us</em>, the Webhook Secret is used by <em>you</em> to verify that incoming webhook events actually came from VTU API Manager.
            </p>

            <Callout type="warning" title="Separate Credentials">
                Never use your API Key to validate webhooks, and never use your Webhook Secret to make API calls. They serve two entirely different security purposes.
            </Callout>

            {/* IP ALLOWLISTING */}
            <h2 id="ip-allowlisting" className="group relative text-2xl font-bold text-foreground mt-12 mb-4 border-b border-border pb-3 scroll-mt-28">
                <a href="#ip-allowlisting" className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity">#</a>
                IP Allowlisting (Coming Soon)
            </h2>
            <p className="text-muted-foreground mb-4">
                To add an extra layer of security to your Production API keys, you will soon be able to specify a list of allowed IP addresses. Once configured, API requests made with your Live Key from an IP address not on the allowlist will be rejected, even if the key is correct.
            </p>

        </DocsLayout>
    );
}