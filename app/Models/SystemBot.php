<?php

namespace App\Models;

use App\EnvironmentAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemBot extends Model
{
    /** @use HasFactory<\Database\Factories\SystemBotFactory> */
    use HasFactory;

    protected $fillable = ['name', 'platform', 'credentials', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'credentials' => 'array', // Automatically casts JSON to PHP Array
        ];
    }
}
