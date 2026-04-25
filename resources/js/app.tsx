import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

createInertiaApp({
    title: (title) => {
        // 1. Set a fallback name
        let dynamicAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

        // 2. Safely extract the dynamic app name from Inertia's DOM payload
        try {
            const pageElement = document.getElementById('app');
            if (pageElement && pageElement.dataset.page) {
                const pageData = JSON.parse(pageElement.dataset.page);
                // Grab the general.app_name you defined in HandleInertiaRequests.php
                if (pageData?.props?.general?.app_name) {
                    dynamicAppName = pageData.props.general.app_name;
                }
            }
        } catch (error) {
            console.error('Could not parse page data for title.');
        }

        // 3. Return the dynamic format (e.g., "Dashboard - VTU API Manager")
        return `${title} - ${dynamicAppName}`;
    },
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
