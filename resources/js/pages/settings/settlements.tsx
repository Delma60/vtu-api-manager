import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout'; // Adjust path if needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Props {
    business: {
        settlement_bank: string | null;
        settlement_account_number: string | null;
        settlement_account_name: string | null;
        settlement_schedule: string;
    };
}

export default function SettlementPreferences({ business }: Props) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        settlement_bank: business.settlement_bank || '',
        settlement_account_number: business.settlement_account_number || '',
        settlement_account_name: business.settlement_account_name || '',
        settlement_schedule: business.settlement_schedule || 'manual',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.settlements.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout>
            <Head title="Settlement Preferences" />

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Settlement Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your payout bank accounts and how often you want to receive your cleared funds.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Bank Details</CardTitle>
                        <CardDescription>
                            Where should we send your money when it clears probation?
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="settlement_bank">Bank Name</Label>
                                    <Input
                                        id="settlement_bank"
                                        placeholder="e.g. GTBank, Kuda, Zenith"
                                        value={data.settlement_bank}
                                        onChange={(e) => setData('settlement_bank', e.target.value)}
                                    />
                                    <InputError message={errors.settlement_bank} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="settlement_account_number">Account Number</Label>
                                    <Input
                                        id="settlement_account_number"
                                        placeholder="1234567890"
                                        value={data.settlement_account_number}
                                        onChange={(e) => setData('settlement_account_number', e.target.value)}
                                    />
                                    <InputError message={errors.settlement_account_number} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="settlement_account_name">Account Name</Label>
                                    <Input
                                        id="settlement_account_name"
                                        placeholder="John Doe Enterprises"
                                        value={data.settlement_account_name}
                                        onChange={(e) => setData('settlement_account_name', e.target.value)}
                                    />
                                    <InputError message={errors.settlement_account_name} />
                                </div>
                            </div>

                            <div className="space-y-2 mt-6">
                                <Label htmlFor="settlement_schedule">Settlement Schedule</Label>
                                <Select
                                    value={data.settlement_schedule}
                                    onValueChange={(value) => setData('settlement_schedule', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a schedule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manual">Manual (I will request payouts)</SelectItem>
                                        <SelectItem value="daily">Daily Auto-Sweep</SelectItem>
                                        <SelectItem value="weekly">Weekly Auto-Sweep</SelectItem>
                                        <SelectItem value="monthly">Monthly Auto-Sweep</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Determines how often cleared funds move from your available balance to your bank account.
                                </p>
                                <InputError message={errors.settlement_schedule} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save Preferences</Button>
                                {recentlySuccessful && (
                                    <p className="text-sm text-green-600 font-medium">Saved successfully.</p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    );
}