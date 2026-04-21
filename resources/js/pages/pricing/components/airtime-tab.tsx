import DeleteButton from '@/components/delete-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { DiscountPlan } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface AirtimeTabProps {
    airtime_plans: DiscountPlan[];
}

const AirtimeTab = ({ airtime_plans }: AirtimeTabProps) => {
    const updateDiscount = (id: string | number, field: string, value: string | number | boolean) => {
        router.patch(route('discounts.update', id), { [field]: value });
    };
    return (
        <Card className="h-min flex-1 overflow-x-auto rounded-none border-0 bg-transparent shadow-none">
            <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-base font-semibold">Direct Airtime Discounts</h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                        Set the percentage discount you offer your API users. Lower numbers equal higher profit for you.
                    </p>
                </div>
                <Link
                    href={route('pricing.airtime-plan.create')}
                    // className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-emerald-500"
                >
                    <Button size="sm">
                        <Plus />
                        <span>Create Airtime Plan</span>
                    </Button>
                </Link>
            </div>
            <CardContent className="m-0 p-0">
                <table className="w-full text-left text-sm">
                    <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-3">Network Type</th>
                            <th className="px-6 py-3">Network</th>
                            <th className="px-6 py-3">Min/Max</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {airtime_plans.map((net: DiscountPlan) => {
                            return (
                                <tr key={net.id} className={net.is_active ? 'hover:bg-muted/30' : 'opacity-50'}>
                                    <td className="px-6 py-5">
                                        <span className="font-semibold">{net.plan_type?.name}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                                            {net.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                                            {net.min_amount}|{net.max_amount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => router.get(route('pricing.airtime-plan.edit', net.id))}
                                                className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors"
                                            >
                                                Edit
                                            </Button>
                                            <Separator orientation="vertical" className="mr-2 h-5" />
                                            <div className="flex items-center gap-2 pr-1">
                                                <DeleteButton
                                                    className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-sm"
                                                    route={route('discounts.destroy', net.id)}
                                                    resourceName={'discount plan'}
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

export default AirtimeTab;
