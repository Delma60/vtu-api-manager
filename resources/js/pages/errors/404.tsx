import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button'; // Assuming you are using your standard shadcn/ui button

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
            <Head title="404 - Page Not Found" />
            
            {/* Background 404 Text */}
            <h1 className="text-9xl font-extrabold text-muted/30 tracking-widest">
                404
            </h1>
            
            {/* Foreground Badge */}
            <div className="bg-primary px-2 text-sm rounded rotate-12 absolute text-primary-foreground">
                Page Not Found
            </div>
            
            <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                    Oops! We can't find that page.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                
                {/* Back to Home Button */}
                <Link href="/">
                    <Button size="lg">Go Back Home</Button>
                </Link>
            </div>
        </div>
    );
}