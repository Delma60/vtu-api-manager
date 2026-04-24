<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentationController extends Controller
{
    public function show($page = 'introduction')
    {
        $path = resource_path("docs/{$page}.md");

        if (!file_exists($path)) {
            abort(404);
        }

        $content = file_get_contents($path);

        // You can also pass a hardcoded or dynamically generated navigation tree
        return inertia('docs/show', [
            'title' => Str::title(str_replace('-', ' ', basename($page))),
            'content' => $content,
            'currentSlug' => $page,
        ]);
    }

    public function pins()
    {
        return \Inertia\Inertia::render('docs/pins');
    }

    public function airtime(){
        return \Inertia\Inertia::render('docs/airtime', [
            'title' => 'Airtime',
            'currentSlug' => 'airtime',
        ]);
    }

    public function apiKey(){
        return \Inertia\Inertia::render('docs/api-keys', [
            'title' => 'API Keys',
            'currentSlug' => 'api-keys',
        ]);
    }

    public function data(){
        return \Inertia\Inertia::render('docs/data', [
            'title' => 'Data',
            'currentSlug' => 'data',
        ]);
    }
    public function dataPlans(){
        return \Inertia\Inertia::render('docs/data-plans', [
            'title' => 'Data Plans',
            'currentSlug' => 'data-plans',
        ]);
    }
    public function authentication(){
        return \Inertia\Inertia::render('docs/authentication', [
            'title' => 'Authentication',
            'currentSlug' => 'authentication',
        ]);
    }
    public function quickStart(){
        return \Inertia\Inertia::render('docs/quick-start', [
            'title' => 'Quick Start',
            'currentSlug' => 'quick-start',
        ]);
    }
    // public function airtime(){}
}
