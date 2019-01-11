<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Builder;

class Menu extends Model
{
    protected $table = 'menus';

    protected $fillable = [
        'name',
    ];

    public function elements()
    {
        return $this->hasMany('\Modules\Architect\Entities\MenuElement');
    }

    public function fields()
    {
        return $this->hasManyThrough('\Modules\Architect\Entities\MenuElementField', '\Modules\Architect\Entities\MenuElement');
    }

    public function scopeHasContent(Builder $query, $content)
    {
        return $query->whereHas('fields', function ($q) use ($content) {
            $q
                ->where('relation', 'content')
                ->where('value', $content->id);
        });
    }

    public function scopeHasName(Builder $query, $name)
    {
        return $query->where('name', $name);
    }
}
