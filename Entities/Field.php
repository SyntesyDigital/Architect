<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{

    protected $casts = [
        'rules' => 'array',
        'settings' => 'array'
    ];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'fields';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'typology_id',
        'name',
        'icon',
        'identifier',
        'type',
        'rules',
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

    public function typology()
    {
        return $this->hasOne('\Modules\Architect\Entities\Typology', "id", "typology_id");
    }


}
