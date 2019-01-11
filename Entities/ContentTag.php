<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

class ContentTag extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'contents_tags';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

    public $timestamps = false;
}
