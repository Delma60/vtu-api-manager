import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Network, NetworkType } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface NetworkTypeTabProps {
    networks: Network[];
    network_types: NetworkType[];
}
const NetworkTypeTab = ({ networks, network_types }: NetworkTypeTabProps) => {
    const {
        setData: setTypeData,
        data: typeData,
        post: postType,
        processing: typeProcessing,
        errors: typeErrors,
        reset: resetType,
    } = useForm<NetworkType>({
        name: '',
        network_id: '',
        is_active: true,
        type: 'airtime',
    });

    const updateNetworkType = (id: string|number, field: string, value: string|number|boolean) => {
        router.patch(route('network-types.update', id), { [field]: value });
    };

    return (
        <div className="flex-1 overflow-x-auto">
            <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-base font-semibold">Network Service Types</h2>
                    <p className="text-muted-foreground mt-1 text-xs">Manage service categories like SME, SMS, Gifting, VUT, and more.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            Add Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                            <h3 className="text-lg font-semibold">Add New Service Type</h3>
                            <p className="text-muted-foreground mt-1 text-xs">Create a new service category for networks.</p>
                        </div>

                        <div className="space-y-5 py-2">
                            <div>
                                <Label className="mb-1.5 block">Type Name</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g., Enterprise, Corporate"
                                    value={typeData.name}
                                    onChange={(e) => setTypeData('name', e.target.value)}
                                />
                                <InputError message={typeErrors.name} />
                            </div>

                            <div>
                                <Label className="mb-1.5 block">Associated Network</Label>
                                <Select value={typeData.network_id || ''} onValueChange={(e) => setTypeData('network_id', e)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Network" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {networks.map((network) => (
                                            <SelectItem disabled={!network.is_active} key={network.id} value={network.id.toString()}>
                                                {network.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={typeErrors.network_id} />
                            </div>

                            <div>
                                <Label className="mb-1.5 block">Service Type</Label>
                                <Select value={typeData.type || ''} onValueChange={(e) => setTypeData('type', e)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Service Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="airtime">Airtime</SelectItem>
                                        <SelectItem value="data">Data</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={typeErrors.type} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch checked={typeData.is_active} onCheckedChange={(checked:boolean) => setTypeData('is_active', checked)} />
                                <Label className="text-sm font-medium">Active</Label>
                                <InputError message={typeErrors.is_active} />
                            </div>
                        </div>

                        <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                            <Button variant="ghost" type="button">
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => postType(route('network-types.store'), { onSuccess: () => resetType() })}
                                disabled={typeProcessing}
                            >
                                {typeProcessing ? 'Creating...' : 'Create Type'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                    <tr>
                        <th className="px-6 py-3">Type Name</th>
                        <th className="px-6 py-3">Service Type</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-border divide-y">
                    {network_types.map((type) => (
                        <tr key={type.id} className="hover:bg-muted/30">
                            <td className="px-6 py-5">
                                <span className="font-semibold">{type.name}</span>
                            </td>
                            <td className="px-6 py-5">
                                <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                                    {type.type}|{type.typeable.name}
                                </span>
                            </td>

                            <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-6">
                                    <EditNetworkType network_type={type} networks={networks} />

                                    <div className="border-border flex items-center gap-2 border-l pl-6">
                                        <DeleteButton
                                            route={route('network-types.destroy', type.id)}
                                            resourceName="network type"
                                            className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-xs font-medium transition-colors hover:bg-transparent"
                                        />
                                    </div>
                                    <div className="border-border flex items-center gap-2 border-l pl-6">
                                        <IsActiveSwitch
                                            checked={type.is_active}
                                            onCheckedChange={(checked) => updateNetworkType(type.id, 'is_active', checked)}
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
    );
};

export default NetworkTypeTab;

const EditNetworkType = ({ network_type, networks }: { network_type: NetworkType; networks: Network[] }) => {
    const { setData, data, processing, errors, patch } = useForm<NetworkType>({
        ...network_type,
        network_id: network_type?.typeable?.id || '',
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors">Edit</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                    <h3 className="text-lg font-semibold">Edit Service Type</h3>
                    <p className="text-muted-foreground mt-1 text-xs">Update configuration for {network_type.name}.</p>
                </div>

                <div className="space-y-5 py-2">
                    <div>
                        <Label className="mb-1.5 block">Type Name</Label>
                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Associated Network</Label>
                        <Select value={data.network_id} onValueChange={(e) => setData('network_id', e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Network" />
                            </SelectTrigger>
                            <SelectContent>
                                {networks.map((network) => (
                                    <SelectItem key={network.id} value={network.id.toString()}>
                                        {network.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.network_id} />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Service Type</Label>
                        <Select value={data.type || ''} onValueChange={(e) => setData('type', e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="airtime">Airtime</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                        <Label className="text-sm font-medium">Active</Label>
                        <InputError message={errors.is_active} />
                    </div>
                </div>

                <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                    <Button type="button" variant="ghost">
                        Cancel
                    </Button>
                    <Button type="button" disabled={processing} onClick={() => patch(route('network-types.update', data.id))}>
                        {processing ? 'Updating...' : 'Update Type'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

