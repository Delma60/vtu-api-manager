import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Wallet as WalletIcon, ArrowDownToLine, Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';


const TopupWallet = () => {
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
    });

    const submitFund: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('wallet.fund'), {
            onSuccess: () => {
                setIsTopUpOpen(false);
                reset();
            }
        });
    };
    return (
        <div>
            <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                <DialogTrigger asChild>
                    <Button className="border-0 ">
                        <Plus className="mr-2 h-4 w-4" /> Top Up Wallet
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Top up your Wallet</DialogTitle>
                        <DialogDescription>Enter the amount you wish to add to your account balance.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitFund} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Amount (₦)</Label>
                            <Input
                                type="number"
                                min="100"
                                placeholder="e.g. 5000"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                            />
                            {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsTopUpOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing || !data.amount}>
                                {processing ? 'Connecting...' : 'Pay with Gateway'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TopupWallet;
