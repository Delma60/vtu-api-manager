import DeleteButton from '@/components/delete-button';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getNetworkColor } from '@/lib/utils';
import { DataPlan } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';


interface DataTabProps {
    data_plans: DataPlan[];
}

const DataTab = ({ data_plans }: DataTabProps) => {
    const updateService = (id: string | number, field: string, value: string | number | boolean) => {
        router.patch(route('data-plans.update', id), { [field]: value });
    };
    return (
        <div className="flex flex-1 flex-col overflow-x-auto">
            <div className="border-border bg-muted/50 flex shrink-0 items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-base font-semibold">Direct Data Plans</h2>
                    <p className="text-muted-foreground mt-1 text-xs">Configure your cost price and your selling price.</p>
                </div>
                <Link href={route('data-plans.create')}>
                    <Button size="sm" className="gap-1.5">
                        <Plus className="h-4 w-4" /> Add New Plan
                    </Button>
                </Link>
            </div>
            <div className="custom-scrollbar flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-border bg-muted/80 text-muted-foreground sticky top-0 z-10 border-b text-[11px] font-semibold uppercase backdrop-blur-sm">
                        <tr>
                            <th className="px-6 py-3">Network</th>
                            <th className="w-32 px-6 py-3">Plan Type</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3 text-right">Active</th>
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {data_plans.map((service) => {
                            return (
                                <tr key={service.id} className={service.is_active ? 'hover:bg-muted/30' : 'opacity-50'}>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${getNetworkColor(service.network)}`}></span>
                                            <span className="font-medium">{service.network}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-semibold uppercase">{service.plan_name}</td>
                                    <td className="text-muted-foreground px-6 py-3">{service.plan_type}</td>

                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('data-plans.edit', service.id)}
                                                className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors"
                                            >
                                                Edit plan
                                            </Link>
                                            <Separator orientation="vertical" className="mr-2 h-5" />
                                            <div className="flex items-center gap-2 pr-1">
                                                <DeleteButton
                                                    className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-sm"
                                                    route={route('data-plans.destroy', { data_plan: service.id })}
                                                    resourceName={'data plan'}
                                                    buttonSize="sm"
                                                    variant="link"
                                                >
                                                    Delete
                                                </DeleteButton>
                                            </div>
                                            <Separator orientation="vertical" className="mr-2 h-5" />
                                            <div className="flex items-center gap-2">
                                                <IsActiveSwitch
                                                    checked={service.is_active}
                                                    onCheckedChange={(checked) => updateService(service.id, 'is_active', checked)}
                                                    label=""
                                                    className="justify-end"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {data_plans.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center">
                                    No data plans configured yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTab;
