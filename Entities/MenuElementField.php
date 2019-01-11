<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;
use Storage;

class MenuElementField extends Model
{
    protected $table = 'menus_elements_fields';

    protected $fillable = [
        'element_id',
        'language_id',
        'parent_id',
        'name',
        'value',
        'relation',
    ];

    public $timestamps = false;

    public function element()
    {
        return $this->belongsTo('\Modules\Architect\Entities\Element');
    }
}
