import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export function FlashMessages() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (!flash || Object.keys(flash).length === 0) {
            return;
        }

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return <Toaster />;
}
