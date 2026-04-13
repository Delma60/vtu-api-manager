import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateAirtimePlan({ networks, providers }) {
  // Fallbacks for UI preview if props aren't passed yet
  const activeNetworks = networks || [{ id: 1, name: 'MTN' }, { id: 2, name: 'Airtel' }];
  const activeProviders = providers || [{ id: 1, name: 'VTpass' }, { id: 2, name: 'MTN Direct' }];

  const { data, setData, post, processing, errors } = useForm({
    network_id: '',
    provider_id: '',
    vendor_api_code: '',
    discount_percentage: '',
    pin_discount_percentage: '',
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/pricing/airtime-plan');
  };

  return (
    <div className="flex-1 bg-slate-950 min-h-screen p-8 text-slate-200 font-sans">
      <Head title="Create Airtime Plan" />

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl mx-auto">
        <div>
          <Link href="/pricing" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors mb-2 group">
            <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Pricing
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Airtime Configuration</h1>
          <p className="text-sm text-slate-400 mt-1">Set up routing and discount margins for VTU and Airtime PINs.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        
        {/* ROW 1: General Information & Routing */}
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white">Row 1: Identity & Vendor Routing</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400">Active Status</span>
              <button
                type="button"
                onClick={() => setData('is_active', !data.is_active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Network */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Network</label>
              <select
                value={data.network_id}
                onChange={e => setData('network_id', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                <option value="" disabled>Select Network...</option>
                {activeNetworks.map(net => (
                  <option key={net.id} value={net.id}>{net.name}</option>
                ))}
              </select>
              {errors.network_id && <p className="text-rose-400 text-xs mt-1">{errors.network_id}</p>}
            </div>

            {/* Upstream Provider */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upstream Provider</label>
              <select
                value={data.provider_id}
                onChange={e => setData('provider_id', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                <option value="" disabled>Select Vendor...</option>
                {activeProviders.map(prov => (
                  <option key={prov.id} value={prov.id}>{prov.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Who fulfills this request?</p>
              {errors.provider_id && <p className="text-rose-400 text-xs mt-1">{errors.provider_id}</p>}
            </div>

            {/* Vendor API Code */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Vendor API Code</label>
              <input
                type="text"
                value={data.vendor_api_code}
                onChange={e => setData('vendor_api_code', e.target.value)}
                placeholder="e.g., mtn_custom_vtu"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
              />
              <p className="text-[10px] text-slate-500 mt-1">The exact payload code the vendor expects.</p>
              {errors.vendor_api_code && <p className="text-rose-400 text-xs mt-1">{errors.vendor_api_code}</p>}
            </div>
          </div>
        </div>

        {/* ROW 2: Financials & Margins */}
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-base font-semibold text-white">Row 2: Financials & Margins</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct VTU Discount */}
            <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800">
              <label className="block text-sm font-medium text-slate-300 mb-2">Direct VTU Discount (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={data.discount_percentage}
                  onChange={e => setData('discount_percentage', e.target.value)}
                  placeholder="e.g., 2.5"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-lg font-bold"
                />
                <span className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-2.5 rounded-lg border border-slate-700 whitespace-nowrap">
                  User pays {100 - (Number(data.discount_percentage) || 0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">The percentage off face value given to your API users when they buy standard airtime.</p>
              {errors.discount_percentage && <p className="text-rose-400 text-xs mt-1">{errors.discount_percentage}</p>}
            </div>

            {/* Airtime PIN Discount */}
            <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800">
              <label className="block text-sm font-medium text-slate-300 mb-2">Airtime PIN Discount (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={data.pin_discount_percentage}
                  onChange={e => setData('pin_discount_percentage', e.target.value)}
                  placeholder="e.g., 2.0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-lg font-bold"
                />
                <span className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-2.5 rounded-lg border border-slate-700 whitespace-nowrap">
                  User pays {100 - (Number(data.pin_discount_percentage) || 0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">The percentage off face value given when generating printable Airtime PINs.</p>
              {errors.pin_discount_percentage && <p className="text-rose-400 text-xs mt-1">{errors.pin_discount_percentage}</p>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2"
          >
            {processing && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Create Airtime Plan
          </button>
        </div>

      </form>
    </div>
  );
}