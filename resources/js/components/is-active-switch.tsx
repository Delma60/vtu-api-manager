import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type IsActiveSwitchProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    labelClassName?: string;
    switchClassName?: string;
};

export function IsActiveSwitch({
    checked,
    onCheckedChange,
    label = 'Active Status',
    description,
    disabled = false,
    id,
    className,
    labelClassName,
    switchClassName,
}: IsActiveSwitchProps) {
    const showLabel = Boolean(label?.length);

    return (
        <div className={cn('flex items-center justify-between gap-4', className)}>
            {showLabel ? (
                <div className="min-w-0">
                    <Label htmlFor={id} className={labelClassName}>
                        {label}
                    </Label>
                    {description ? <p className="text-xs text-slate-500">{description}</p> : null}
                </div>
            ) : null}
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} className={switchClassName} />
        </div>
    );
}
