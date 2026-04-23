import { useForm } from '@inertiajs/react';
// import { LoaderCircle } from 'lucide-react';
// import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';

// import InputError from '@/components/input-error';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

// export default function Login({ status, canResetPassword }: LoginProps) {
//     const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
//             <Head title="Log in" />

//             <form className="flex flex-col gap-6" onSubmit={submit}>
//                 <div className="grid gap-6">
//                     <div className="grid gap-2">
//                         <Label htmlFor="email">Email address</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             required
//                             autoFocus
//                             tabIndex={1}
//                             autoComplete="email"
//                             value={data.email}
//                             onChange={(e) => setData('email', e.target.value)}
//                             placeholder="email@example.com"
//                         />
//                         <InputError message={errors.email} />
//                     </div>

//                     <div className="grid gap-2">
//                         <div className="flex items-center">
//                             <Label htmlFor="password">Password</Label>
//                             {canResetPassword && (
//                                 <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
//                                     Forgot password?
//                                 </TextLink>
//                             )}
//                         </div>
//                         <Input
//                             id="password"
//                             type="password"
//                             required
//                             tabIndex={2}
//                             autoComplete="current-password"
//                             value={data.password}
//                             onChange={(e) => setData('password', e.target.value)}
//                             placeholder="Password"
//                         />
//                         <InputError message={errors.password} />
//                     </div>

//                     <div className="flex items-center space-x-3">
//                         <Checkbox id="remember" name="remember" tabIndex={3} />
//                         <Label htmlFor="remember">Remember me</Label>
//                     </div>

//                     <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
//                         {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                         Log in
//                     </Button>
//                 </div>

//                 <div className="text-muted-foreground text-center text-sm">
//                     Don't have an account?{' '}
//                     <TextLink href={route('register')} tabIndex={5}>
//                         Sign up
//                     </TextLink>
//                 </div>
//             </form>

//             {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
//         </AuthLayout>
//     );
// }

export default function LoginPage() {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 py-12 font-sans selection:bg-indigo-500 selection:text-white sm:px-6 lg:px-8 p-4">
            {/* Background Decorative Blurs */}
            <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-full max-w-lg -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-purple-500/0 blur-3xl"></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-8 flex items-center justify-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30"></div>
                    <span className="text-2xl font-bold tracking-tight text-white">NexusVTU</span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">Sign in to your dashboar</h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Or{' '}
                    <a href="/register" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                        create a free developer account
                    </a>
                </p>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="border border-slate-800 bg-[#0f172a] px-4 py-8 shadow-2xl sm:rounded-2xl sm:px-10">
                    <form onSubmit={submit} className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="developer@company.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block cursor-pointer text-sm text-slate-400">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                disabled={processing}
                                type="submit"
                                className="flex w-full justify-center rounded-lg border border-transparent disabled:bg-indigo-600/50 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
                            >
                                {processing ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-[#0f172a] px-2 text-slate-500">Or continue with</span>
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
                                Sign in with GitHub
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Link */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    Having trouble logging in?{' '}
                    <a href="#" className="transition-colors hover:text-slate-300">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
