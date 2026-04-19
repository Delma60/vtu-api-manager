import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getNetworkColor } from '@/lib/utils';
import { Network } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

interface NetworkTabProps {
    networks: Network[];
}
const NetworkTab = ({ networks }: NetworkTabProps) => {
    const { setData, data, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        airtime_api_id: '0',
        airtime_pin_api_id: '0',
        data_api_id: '0',
        data_pin_api_id: '0',
    });

    const updateNetwork = (id: string, field: string, value: string | number | boolean) => {
        router.patch(route('networks.update', id), { [field]: value });
    };
    useEffect(() => {
        if (data.name) {
            const generatedCode = data.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '');
            setData('code', generatedCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.name]);

    return (
        <div>
            <div className="flex-1 overflow-x-auto">
                <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                    <div>
                        <h2 className="text-base font-semibold">Global Network Toggles</h2>
                        <p className="text-muted-foreground mt-1 text-xs">
                            Turn off an entire network if the upstream provider is having global downtime.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                Add Network
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                                <h3 className="text-lg font-semibold">Add New Network</h3>
                                <p className="text-muted-foreground mt-1 text-xs">Configure global discounts for a new provider.</p>
                            </div>

                            <div className="space-y-5 py-2">
                                <div>
                                    <Label className="mb-1.5 block">Network Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="e.g., Smile Data"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label className="mb-1.5 block">Internal Code</Label>
                                    <Input
                                        type="text"
                                        placeholder="Auto-generated from name"
                                        value={data.code}
                                        readOnly
                                        className="bg-muted text-muted-foreground cursor-not-allowed font-mono"
                                    />
                                    <InputError message={errors.code} />
                                    <p className="text-muted-foreground mt-1.5 text-[10px] tracking-wider uppercase">
                                        Auto-generated from name. Lowercase letters, numbers, and underscores only.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-1.5 block">Airtime API ID</Label>
                                        <Input
                                            type="number"
                                            value={data.airtime_api_id}
                                            onChange={(e) => setData('airtime_api_id', e.target.value)}
                                        />
                                        <InputError message={errors.airtime_api_id} />
                                    </div>
                                    <div>
                                        <Label className="mb-1.5 block">Airtime Pin API ID</Label>
                                        <Input
                                            type="number"
                                            value={data.airtime_pin_api_id}
                                            onChange={(e) => setData('airtime_pin_api_id', e.target.value)}
                                        />
                                        <InputError message={errors.airtime_pin_api_id} />
                                    </div>
                                    <div>
                                        <Label className="mb-1.5 block">Data API ID</Label>
                                        <Input type="number" value={data.data_api_id} onChange={(e) => setData('data_api_id', e.target.value)} />
                                        <InputError message={errors.data_api_id} />
                                    </div>
                                    <div>
                                        <Label className="mb-1.5 block">Data Pin API ID</Label>
                                        <Input
                                            type="number"
                                            value={data.data_pin_api_id}
                                            onChange={(e) => setData('data_pin_api_id', e.target.value)}
                                        />
                                        <InputError message={errors.data_pin_api_id} />
                                    </div>
                                </div>
                            </div>

                            <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                                <Button variant="ghost" type="button">
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => post(route('networks.store'), { onSuccess: () => reset() })}
                                >
                                    {processing ? 'Creating Network...' : 'Create Network'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-3">Network</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {networks.map((net: Network) => (
                            <tr key={net.id} className="hover:bg-muted/30">
                                <td className="flex items-center gap-3 px-6 py-5">
                                    <span className={`h-3 w-3 rounded-full ${getNetworkColor(net.name)}`}></span>
                                    <span className="text-base font-semibold">{net.name}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-6">
                                        <EditNetwork network={net} />

                                        <div className="border-border flex items-center gap-2 border-l pl-6">
                                            <DeleteButton
                                                route={route('networks.destroy', net.id)}
                                                resourceName="network"
                                                className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-xs font-medium transition-colors hover:bg-transparent"
                                            />
                                        </div>
                                        <div className="border-border flex items-center gap-2 border-l pl-6">
                                            <IsActiveSwitch
                                                checked={net.is_active}
                                                onCheckedChange={(checked) => updateNetwork(net.id, 'is_active', checked)}
                                                label=""
                                                className="justify-end"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NetworkTab;

const EditNetwork = ({ network }: { network: Network }) => {
    const { setData, data, processing, errors, patch } = useForm<Network>(network);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors">Edit</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                    <h3 className="text-lg font-semibold">Edit Network</h3>
                    <p className="text-muted-foreground mt-1 text-xs">Update configuration for {network.name}.</p>
                </div>

                <div className="space-y-5 py-2">
                    <div>
                        <Label className="mb-1.5 block">Network Name</Label>
                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Internal Code</Label>
                        <Input type="text" readOnly value={data.code} className="bg-muted text-muted-foreground cursor-not-allowed font-mono" />
                        <InputError message={errors.code} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-1.5 block">Airtime API ID</Label>
                            <Input type="number" value={data.airtime_api_id} onChange={(e) => setData('airtime_api_id', e.target.value)} />
                            <InputError message={errors.airtime_api_id} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Airtime Pin API ID</Label>
                            <Input type="number" value={data.airtime_pin_api_id} onChange={(e) => setData('airtime_pin_api_id', e.target.value)} />
                            <InputError message={errors.airtime_pin_api_id} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Data API ID</Label>
                            <Input type="number" value={data.data_api_id} onChange={(e) => setData('data_api_id', e.target.value)} />
                            <InputError message={errors.data_api_id} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Data Pin API ID</Label>
                            <Input type="number" value={data.data_pin_api_id} onChange={(e) => setData('data_pin_api_id', e.target.value)} />
                            <InputError message={errors.data_pin_api_id} />
                        </div>
                    </div>
                </div>

                <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                    <Button type="button" variant="ghost">
                        Cancel
                    </Button>
                    <Button type="button" disabled={processing} onClick={() => patch(route('networks.update', data.id))}>
                        {processing ? 'Updating...' : 'Update Network'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
