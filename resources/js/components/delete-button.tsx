import { useForm } from '@inertiajs/react';
import React, { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
    route: string;
    resourceName: string;
    requirePassword?: boolean;
    onSuccess?: () => void;
    buttonText?: string;
    buttonSize?: 'sm' | 'md' | 'lg' | 'icon';
    className?: string;
    children?:React.ReactNode
}

export default function DeleteButton({
    route,
    resourceName,
    requirePassword = false,
    onSuccess,
    buttonText = 'Delete',
    buttonSize = 'md',
    children,
    className,
}: DeleteButtonProps) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                onSuccess?.();
            },
            onError: () => {
                if (requirePassword) {
                    passwordInput.current?.focus();
                }
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
        icon: 'h-9 w-9',
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size={buttonSize === 'icon' ? 'icon' : 'default'} className={className}>
                    {buttonSize === 'icon' ? <Trash2 className="h-4 w-4" /> : children ? children :(buttonText)}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete {resourceName}?</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this {resourceName}? This action cannot be undone.
                </DialogDescription>

                <form className="space-y-6" onSubmit={handleDelete}>
                    {requirePassword && (
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password to confirm"
                                autoComplete="current-password"
                            />

                            <InputError message={errors.password} />
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Delete</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
