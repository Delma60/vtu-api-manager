import { usePage } from "@inertiajs/react";


export default function AppLogo() {
    const { general } = usePage().props;
    return (
        <img 
            src={general.site_logo} 
            alt={general.site_name} 
            className="h-8 w-auto" 
        />
    );
}
