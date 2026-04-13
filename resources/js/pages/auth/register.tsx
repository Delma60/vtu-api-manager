import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// import InputError from '@/components/input-error';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms?: boolean;
}

// export default function Register() {
//

//     return (
//         <AuthLayout title="Create an account" description="Enter your details below to create your account">
//             <Head title="Register" />
//             <form className="flex flex-col gap-6" onSubmit={submit}>
//                 <div className="grid gap-6">
//                     <div className="grid gap-2">
//                         <Label htmlFor="name">Name</Label>
//                         <Input
//                             id="name"
//                             type="text"
//                             required
//                             autoFocus
//                             tabIndex={1}
//                             autoComplete="name"
//                             value={data.name}
//                             onChange={(e) => setData('name', e.target.value)}
//                             disabled={processing}
//                             placeholder="Full name"
//                         />
//                         <InputError message={errors.name} className="mt-2" />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="email">Email address</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             required
//                             tabIndex={2}
//                             autoComplete="email"
//                             value={data.email}
//                             onChange={(e) => setData('email', e.target.value)}
//                             disabled={processing}
//                             placeholder="email@example.com"
//                         />
//                         <InputError message={errors.email} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="password">Password</Label>
//                         <Input
//                             id="password"
//                             type="password"
//                             required
//                             tabIndex={3}
//                             autoComplete="new-password"
//                             value={data.password}
//                             onChange={(e) => setData('password', e.target.value)}
//                             disabled={processing}
//                             placeholder="Password"
//                         />
//                         <InputError message={errors.password} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="password_confirmation">Confirm password</Label>
//                         <Input
//                             id="password_confirmation"
//                             type="password"
//                             required
//                             tabIndex={4}
//                             autoComplete="new-password"
//                             value={data.password_confirmation}
//                             onChange={(e) => setData('password_confirmation', e.target.value)}
//                             disabled={processing}
//                             placeholder="Confirm password"
//                         />
//                         <InputError message={errors.password_confirmation} />
//                     </div>

//                     <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
//                         {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                         Create account
//                     </Button>
//                 </div>

//                 <div className="text-muted-foreground text-center text-sm">
//                     Already have an account?{' '}
//                     <TextLink href={route('login')} tabIndex={6}>
//                         Log in
//                     </TextLink>
//                 </div>
//             </form>
//         </AuthLayout>
//     );
// }

export default function RegisterPage() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 py-12 font-sans selection:bg-indigo-500 selection:text-white sm:px-6 lg:px-8">
            {/* Background Decorative Blurs */}
            <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-full max-w-lg -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-500/20 to-indigo-500/0 blur-3xl"></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-8 flex items-center justify-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30"></div>
                    <span className="text-2xl font-bold tracking-tight text-white">NexusVTU</span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">Create your workspace</h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                        Sign in here
                    </a>
                </p>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="border border-slate-800 bg-[#0f172a] px-4 py-8 shadow-2xl sm:rounded-2xl sm:px-10">
                    <form onSubmit={submit} className="space-y-5" action="#" method="POST">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                                Company or Developer Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="organization"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="Acme Corp"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                Work Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="dev@acmecorp.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {/* Faux Password Strength Indicator */}
                                <div className="absolute top-3.5 right-3 flex gap-1">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <div className="h-2 w-2 rounded-full bg-slate-600"></div>
                                </div>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="cursor-pointer font-medium text-slate-400">
                                    I agree to the{' '}
                                    <a href="#" className="text-indigo-400 hover:text-indigo-300">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-indigo-400 hover:text-indigo-300">
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={processing}
                                type="submit"
                                className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:bg-indigo-900"
                            >
                                {processing ? "Generating API Keys..." : "Generate API Keys"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-[#0f172a] px-2 text-slate-500">Or register with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-medium text-slate-300 shadow-sm transition-all hover:bg-slate-700 hover:text-white focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
                            >
                                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Sign up with GitHub
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Link */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    Need help setting up?{' '}
                    <a href="#" className="transition-colors hover:text-slate-300">
                        Read the onboarding guide
                    </a>
                </div>
            </div>
        </div>
    );
}
