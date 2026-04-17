import { useEffect, useState } from 'react';

interface TableOfContentsItem {
    id: string;
    level: number;
    title: string;
}

interface DocsTableOfContentsProps {
    headings?: TableOfContentsItem[];
}

export default function DocsTableOfContents({ headings = [] }: DocsTableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // If no headings provided, extract them from the DOM
        if (headings.length === 0) {
            const mainContent = document.querySelector('main');
            if (!mainContent) return;

            const headingElements = mainContent.querySelectorAll('h2, h3, h4');
            const extracted: TableOfContentsItem[] = [];

            headingElements.forEach((element, index) => {
                if (!element.id) {
                    element.id = `heading-${index}`;
                }
                const level = parseInt(element.tagName[1]);
                extracted.push({
                    id: element.id,
                    level,
                    title: element.textContent || '',
                });
            });

            // Observe scroll to highlight active section
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId((entry.target as HTMLElement).id || '');
                        }
                    });
                },
                { rootMargin: '-50% 0px -50% 0px' },
            );

            headingElements.forEach((element) => observer.observe(element));

            return () => observer.disconnect();
        }
    }, [headings]);

    // Extract headings from DOM if not provided
    const [docHeadings, setDocHeadings] = useState<TableOfContentsItem[]>(headings);

    useEffect(() => {
        if (docHeadings.length === 0 && headings.length === 0) {
            const mainContent = document.querySelector('main');
            if (!mainContent) return;

            const headingElements = mainContent.querySelectorAll('h2, h3, h4');
            const extracted: TableOfContentsItem[] = [];

            headingElements.forEach((element, index) => {
                if (!element.id) {
                    element.id = `heading-${index}`;
                }
                const level = parseInt(element.tagName[1]);
                extracted.push({
                    id: element.id,
                    level,
                    title: element.textContent || '',
                });
            });

            setDocHeadings(extracted);
        }
    }, []);

    const finalHeadings = docHeadings.length > 0 ? docHeadings : headings;

    if (finalHeadings.length === 0) return null;

    return (
        <nav className="fixed top-0 right-0 hidden h-screen w-64 overflow-auto border-l border-slate-800/50 bg-slate-950/50 p-6 text-sm backdrop-blur-xl xl:block">
            <h4 className="mb-4 font-semibold text-slate-300">On this page</h4>
            <ul className="space-y-2">
                {finalHeadings.map((heading) => (
                    <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(heading.id);
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`block transition-colors ${
                                activeId === heading.id ? 'font-medium text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                            }`}
                        >
                            {heading.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
