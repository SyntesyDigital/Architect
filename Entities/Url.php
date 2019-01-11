<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    protected $table = 'urls';

    protected $fillable = [
        'url',
        'language_id',
        'entity_id',
        'entity_type'
    ];

    public function entity()
    {
        return $this->morphTo();
    }
}
