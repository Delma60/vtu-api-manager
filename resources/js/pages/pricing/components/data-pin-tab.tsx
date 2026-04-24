import DeleteButton from '@/components/delete-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Link, router } from '@inertiajs/react';
import { Database, Plus, Server } from 'lucide-react';

interface DataPinTabProps {
    data_pin_plans: any[];
}

const DataPinTab = ({ data_pin_plans = [] }: DataPinTabProps) => {
    const updateDiscount = (id: string | number, field: string, value: string | number | boolean) => {
        router.patch(route('discounts.update', id), { [field]: value });
    };

    return (
        <Card className="h-min flex-1 overflow-x-auto rounded-none border-0 bg-transparent shadow-none">
            <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-base font-semibold">Data PIN Plans</h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                        Manage Data Vouchers/PINs (e.g., 1.5GB PINs) fetched from APIs or Local Uploads.
                    </p>
                </div>
                <Link href={route('pricing.data-pin-plan.create')}>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Create Data PIN Plan</span>
                    </Button>
                </Link>
            </div>
            <CardContent className="m-0 p-0">
                <table className="w-full text-left text-sm">
                    <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-3">Plan Name / Volume</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Source Route</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {data_pin_plans.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-muted-foreground px-6 py-8 text-center">
                                    No Data PIN plans configured yet.
                                </td>
                            </tr>
                        )}
                        {data_pin_plans.map((net: any) => {
                            const isApiRouted = net.providers && net.providers.length > 0;

                            return (
                                <tr key={net.id} className={net.is_active ? 'hover:bg-muted/30' : 'opacity-50'}>
                                    <td className="flex flex-col gap-1 px-6 py-5">
                                        <span className="text-base font-semibold">{net.name}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-semibold">₦{net.min_amount}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {isApiRouted ? (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                                <Server className="h-3.5 w-3.5 text-blue-500" />
                                                API Provider ({net.providers[0]?.name})
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                                <Database className="h-3.5 w-3.5 text-emerald-500" />
                                                Local Database
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Separator orientation="vertical" className="mr-2 h-5" />
                                            <div className="flex items-center gap-2 pr-1">
                                                <DeleteButton
                                                    className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-sm"
                                                    route={route('discounts.destroy', net.id)}
                                                    resourceName={'Data PIN Plan'}
                                                    buttonSize="sm"
                                                    variant="link"
                                                >
                                                    Delete
                                                </DeleteButton>
                                            </div>
                                            <Separator orientation="vertical" className="mr-2 h-5" />
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={net.is_active}
                                                    onCheckedChange={(check) => updateDiscount(net.id, 'is_active', check)}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};

export default DataPinTab;
