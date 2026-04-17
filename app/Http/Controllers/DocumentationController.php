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
}
