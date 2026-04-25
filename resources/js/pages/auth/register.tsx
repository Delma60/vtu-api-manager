// resources/js/pages/auth/register.tsx
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface RegisterForm {
    company_name: string; // Added this
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms?: boolean;
}

export default function RegisterPage(props) {
    const appName = props?.general?.app_name;

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        company_name: '',
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
                    <span className="text-2xl font-bold tracking-tight text-white">{appName}</span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">Create your workspace</h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <a href={route('login')} className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                        Sign in here
                    </a>
                </p>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="border border-slate-800 bg-[#0f172a] px-4 py-8 shadow-2xl sm:rounded-2xl sm:px-10">
                    <form onSubmit={submit} className="space-y-5" method="POST">
                        
                        {/* New Field: Company Name */}
                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-slate-300">
                                Workspace / Company Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="company_name"
                                    type="text"
                                    required
                                    autoFocus
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="Acme Corp"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                />
                                <InputError message={errors.company_name} className="mt-2" />
                            </div>
                        </div>

                        {/* Existing Field: Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                                Your Full Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="John Doe"
                                    value={data.name}
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
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="dev@acmecorp.com"
                                    value={data.email}
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
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="cursor-pointer font-medium text-slate-400">
                                    I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>.
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={processing}
                                type="submit"
                                className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:bg-indigo-900"
                            >
                                {processing ? "Generating Workspace..." : "Generate API Keys"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}