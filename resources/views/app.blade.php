<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $site_name ?? config('app.name', 'VTU API Manager') }}</title>
        <meta name="title" inertia content="{{ $site_name ?? config('app.name', 'VTU API Manager') }}">
        <meta name="description" inertia content="{{ $site_description ?? config('app.description', 'VTU API Manager') }}">

        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" inertia content="{{ $site_name ?? config('app.name', 'VTU API Manager') }}">
        <meta property="og:description" inertia content="{{ $site_description ?? 'Manage your VTU services, airtime, and data effortlessly.' }}">
        <meta property="og:image" inertia content="{{ $site_logo ?? asset('logo.svg') }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <link rel="icon" type="image/svg+xml" href="{{ $site_logo ?? asset('favicon.svg') }}">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
