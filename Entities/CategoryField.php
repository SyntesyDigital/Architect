<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

class CategoryField extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'categories_fields';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'value',
        'category_id',
        'language_id',
    ];

    /**
     * The attributes that are hidden from serialization.
     *
     * @var array
     */
    protected $hidden = [
        'deleted_at'
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function category()
    {
        return $this->belongsTo('\Modules\Architect\Entities\Category');
    }

    public function language()
    {
        return $this->belongsTo('\Modules\Architect\Entities\Language');
    }
}
