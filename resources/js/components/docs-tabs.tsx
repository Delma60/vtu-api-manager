import React, { useState } from 'react';

interface TabItem {
    label: string;
    content: React.ReactNode;
}

interface DocsTabsProps {
    items: TabItem[];
    defaultIndex?: number;
}

export default function DocsTabs({ items, defaultIndex = 0 }: DocsTabsProps) {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);

    if (!items.length) return null;

    return (
        <div className="not-prose my-6">
            <div className="flex border-b border-slate-800">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeIndex === index ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">{items[activeIndex] && items[activeIndex].content}</div>
        </div>
    );
}
