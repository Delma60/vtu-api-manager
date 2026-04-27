import { Badge } from '@/components/ui/badge';
import { getDiscountedPrice, handleSubscribe } from '@/lib/utils';
import { Package } from '@/types';
import { Check, CheckCircle2, XCircle } from 'lucide-react'; // Or whatever icon library you use
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

const PackageItem = ({ pkg, currentPackageId }: { pkg: Package; currentPackageId: string | null }) => {
    const finalPrice = getDiscountedPrice(pkg.price, Number(pkg?.discount), pkg?.discount_type);
    const hasDiscount = Number(pkg?.discount) > 0;
    return (
        <Card key={pkg.id} className="border-border relative flex flex-col p-6 shadow-sm">
            {/* Show Discount Badge at the top corner */}
            {hasDiscount && (
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 transform">
                    <Badge variant="destructive" className="animate-pulse shadow-md">
                        {pkg.discount_type === 'percentage' ? `${pkg.discount}% OFF` : `Save ₦${pkg.discount}`}
                    </Badge>
                </div>
            )}

            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 px-0 pb-6">
                <div className="mb-6 flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold">₦{finalPrice.toLocaleString()}</span>
                        <span className="text-muted-foreground font-medium">/ year</span>
                    </div>

                    {/* Strike-through original price */}
                    {hasDiscount && (
                        <div className="text-muted-foreground mt-1 text-sm">
                            Regularly <span className="line-through decoration-red-500">₦{Number(pkg.price).toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Features List */}
                <ul className="text-muted-foreground space-y-3 text-sm">
                    {/* ... Your existing features ... */}
                    {pkg.features?.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="text-primary h-4 w-4" /> {feature}
                        </li>
                    ))}

                    {/* New Bot Access Features */}
                    <li className="flex items-center gap-3">
                        {pkg.settings?.allow_telegram_bot ? (
                            <CheckCircle2 className="text-primary h-5 w-5" />
                        ) : (
                            <XCircle className="text-muted/50 h-5 w-5" />
                        )}
                        <span className={!pkg.settings?.allow_telegram_bot ? 'text-muted-foreground/50' : ''}>Telegram Bot Integration</span>
                    </li>

                    <li className="flex items-center gap-3">
                        {pkg.settings?.allow_whatsapp_bot ? (
                            <CheckCircle2 className="text-primary h-5 w-5" />
                        ) : (
                            <XCircle className="text-muted/50 h-5 w-5" />
                        )}
                        <span className={!pkg.settings?.allow_whatsapp_bot ? 'text-muted-foreground/50' : ''}>WhatsApp Bot Integration</span>
                    </li>
                </ul>
            </CardContent>

            <CardFooter className="mt-auto px-0 pb-0">
                <Button className="w-full" variant={pkg.is_featured ? 'default' : 'outline'} onClick={() => handleSubscribe(pkg.id)}>
                    {Number(currentPackageId) === Number(pkg.id) ? 'Current Plan' : 'Subscribe Now'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PackageItem;
