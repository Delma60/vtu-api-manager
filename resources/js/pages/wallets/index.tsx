import React, { useState } from 'react';

export default function WalletsPage({ wallet, virtualAccounts, fundingHistory }) {
  // Mock data fallbacks for UI rendering
  const currentWallet = wallet || { balance: 45200.50, low_balance_threshold: 10000, auto_recharge_enabled: false };
  const accounts = virtualAccounts || [
    { bank: 'Providus Bank', number: '9908123456', name: 'NexusVTU - Acme Corp' },
    { bank: 'Wema Bank', number: '8200192837', name: 'NexusVTU - Acme Corp' }
  ];

  const isLowBalance = currentWallet.balance < currentWallet.low_balance_threshold;

  return (
    <div className="flex-1 bg-slate-950 min-h-screen p-8 text-slate-200 font-sans">
      
      {/* 1. Header & Actions */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Wallet & Balances</h1>
          <p className="text-sm text-slate-400">Manage your infrastructure funds and automated billing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
            View API Pricing
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Fund via Card
          </button>
        </div>
      </header>

      {/* 2. Top Grid: Main Balance & Virtual Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Main Balance Card */}
        <div className={`p-6 rounded-xl border shadow-sm relative overflow-hidden flex flex-col justify-between ${isLowBalance ? 'bg-rose-950/20 border-rose-900/50' : 'bg-[#0f172a] border-slate-800'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Available API Balance</p>
              <h2 className="text-4xl font-bold text-white">₦{currentWallet.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
          </div>

          <div className="mt-8">
            {isLowBalance ? (
              <div className="flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Balance is below your ₦{currentWallet.low_balance_threshold.toLocaleString()} threshold.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sufficient balance for automated routing.
              </div>
            )}
          </div>
        </div>

        {/* Virtual Accounts Dedicated Funding */}
        <div className="lg:col-span-2 bg-[#0f172a] p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-2">Automated Bank Transfers</h3>
          <p className="text-sm text-slate-400 mb-6">Transfer funds to any of your dedicated accounts below. Your API wallet will be credited instantly.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center group">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{acc.bank}</p>
                  <p className="text-lg font-mono text-white font-bold tracking-widest">{acc.number}</p>
                  <p className="text-xs text-slate-400 mt-1">{acc.name}</p>
                </div>
                <button 
                  className="p-2 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy Account Number"
                  onClick={() => navigator.clipboard.writeText(acc.number)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Settings & Alerts Bar */}
      <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
             <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Low Balance Webhook</h4>
            <p className="text-xs text-slate-400">Receive a POST request when balance drops below ₦10,000.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">Configure Endpoint</button>
           {/* Toggle Switch */}
           <div className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${currentWallet.auto_recharge_enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${currentWallet.auto_recharge_enabled ? 'translate-x-5' : ''}`}></div>
           </div>
        </div>
      </div>

      {/* 4. Funding Ledger / Deposit History */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-base font-semibold text-white">Deposit Ledger</h3>
          <button className="text-sm text-slate-400 hover:text-white transition-colors">Download PDF</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400 whitespace-nowrap">
            <thead className="bg-[#0f172a] text-xs uppercase text-slate-500 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Ref / Note</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              
              {/* Row 1: Bank Transfer Success */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-slate-300">dep_982374a</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">GTBank - Adebayo Dele</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-700 text-xs">
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                    Bank Transfer
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-400">+ ₦50,000.00</td>
                <td className="px-6 py-4 text-slate-500">₦0.00</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">Settled</span>
                </td>
                <td className="px-6 py-4 text-right text-xs">Today, 14:32</td>
              </tr>

              {/* Row 2: Card Payment */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-slate-300">dep_884920c</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Manual Top-up</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-700 text-xs">
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Card (*4920)
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-400">+ ₦10,000.00</td>
                <td className="px-6 py-4 text-rose-400">- ₦150.00</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">Settled</span>
                </td>
                <td className="px-6 py-4 text-right text-xs">Oct 22, 09:15</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}