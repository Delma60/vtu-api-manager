import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Save } from 'lucide-react';
import { useState } from 'react';
import AirtimeTab from './components/airtime-tab';
import DataTab from './components/data-tab';
import NetworkTab from './components/network-tab';
import NetworkTypeTab from './components/network-type-tab';
import { DataPlan, DiscountPlan, Network, NetworkType } from '@/types';

interface Props {
    networks: Network[];
    network_types: NetworkType[];
    airtime_discounts: DiscountPlan[];
    data_plans: DataPlan[];
}
export default function PricingManager({ networks, network_types, airtime_discounts, data_plans }: Props) {
    // get tab from url
    const url = new URL(window.location.href);

    // Tab State
    const tabs = [
        { id: 'network', label: 'Networks Status' },
        { id: 'network_type', label: 'Network Types' },
        { id: 'airtime', label: 'Airtime Discounts' },
        { id: 'airtime_pin', label: 'Airtime PINs' },
        { id: 'data_plan', label: 'Data Plans' },
        { id: 'data_pin', label: 'Data PINs' },
    ];
    const [activeTab, setActiveTab] = useState(url.searchParams.get('tab') ?? 'network');

    const handleChangeTabs = (tabName: string) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tabName);
        window.history.pushState({}, '', newUrl);
        setActiveTab(tabName);
    };

    return (
        <AppLayout>
            <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col font-sans">
                {/* Sticky Header */}
                <header className="border-border bg-background/80 sticky top-0 z-20 flex shrink-0 items-center justify-between border-b px-8 py-5 backdrop-blur-md">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Pricing & Routing Rules</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">Manage global discounts and specific service margins.</p>
                    </div>
                    <div className="flex items-center gap-3">
                       
                    </div>
                </header>

                <div className="flex w-full flex-1 flex-col p-8">
                    <Tabs value={activeTab} onValueChange={handleChangeTabs} className="flex flex-1 flex-col">
                        <TabsList className="tab-list">
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.id} value={tab.id} className="tab-trigger">
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tab Content Container */}
                        <div className="border-border bg-card text-card-foreground flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm">
                            {/* TAB 1: Network Status */}
                            <TabsContent value="network" className="m-0 flex-1 overflow-x-auto outline-none">
                                {/* ... Keep your network status UI here ... */}
                                <NetworkTab networks={networks} />
                            </TabsContent>

                            {/* TAB 2: Network Types */}
                            <TabsContent value="network_type" className="m-0 flex-1 overflow-x-auto outline-none">
                                {/* ... Keep your network types UI here ... */}
                                <NetworkTypeTab network_types={network_types} networks={networks} />
                            </TabsContent>

                            {/* TAB 3 & 4: Airtime & Airtime PINs */}
                            <TabsContent value="airtime" className="m-0 h-min flex-1 overflow-x-auto outline-none">
                                {/* {renderAirtimeTable('Direct Airtime Discounts', true)} */}
                                <AirtimeTab airtime_plans={airtime_discounts} />
                            </TabsContent>

                            <TabsContent value="airtime_pin" className="m-0 h-min flex-1 overflow-x-auto outline-none">
                                {/* {renderAirtimeTable('Airtime PIN Discounts', false)} */}
                            </TabsContent>

                            {/* TAB 5 & 6: Data Plans & Data PINs */}
                            <TabsContent value="data_plan" className="m-0 flex flex-1 flex-col overflow-x-auto outline-none">
                                {/* {renderDataTable('Direct Data Plans')} */}
                                <DataTab data_plans={data_plans} />
                            </TabsContent>

                            <TabsContent value="data_pin" className="m-0 flex flex-1 flex-col overflow-x-auto outline-none">
                                {/* {renderDataTable('Printable Data PINs')} */}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Main Content Area */}
            </div>
        </AppLayout>
    );
}
