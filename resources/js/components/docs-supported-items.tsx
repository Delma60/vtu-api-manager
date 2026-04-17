interface BadgeProps {
    label: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'slate';
}

interface SupportedItemsProps {
    title: string;
    items: (string | BadgeProps)[];
}

const colorMap = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    orange: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    red: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

export default function DocsSupportedItems({ title, items }: SupportedItemsProps) {
    return (
        <div className="not-prose my-6">
            <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => {
                    if (typeof item === 'string') {
                        return (
                            <span key={index} className={`inline-block rounded-lg border px-3 py-1.5 text-sm font-medium ${colorMap.blue}`}>
                                {item}
                            </span>
                        );
                    } else {
                        return (
                            <span
                                key={index}
                                className={`inline-block rounded-lg border px-3 py-1.5 text-sm font-medium ${colorMap[item.color || 'blue']}`}
                            >
                                {item.label}
                            </span>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export function Badge({ label, color = 'blue' }: BadgeProps) {
    return <span className={`inline-block rounded-lg border px-3 py-1.5 text-sm font-medium ${colorMap[color]}`}>{label}</span>;
}
