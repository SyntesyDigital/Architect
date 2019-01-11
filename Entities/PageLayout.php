<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

class PageLayout extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'pages_layouts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'definition',
        'settings'
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

}
