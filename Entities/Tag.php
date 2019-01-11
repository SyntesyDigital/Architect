<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;
use Modules\Architect\Traits\HasFields;
use Kalnoy\Nestedset\NodeTrait;

class Tag extends Model
{
    use HasFields;

    protected $fieldModel = 'Modules\Architect\Entities\TagField';

    protected $appends = ['name'];

    const FIELDS = [
        [
            'name' => 'name',
            'identifier' => 'name',
            'type' => 'text',
            'required' => true
        ],
        [
            'name' => 'slug',
            'identifier' => 'slug',
            'type' => 'slug',
            'required' => true
        ],
        [
            'name' => 'description',
            'identifier' => 'description',
            'type' => 'richtext'
        ],
    ];


    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'tags';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

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

    public function getNameAttribute()
    {
        if($this->fields) {
            foreach($this->fields as $field) {
                if($field->name == 'name') {
                    return $this->getFieldValue($field->name);
                }
            }
        }

        return null;
    }

    public function contents()
    {
        return $this->belongsToMany('\Modules\Architect\Entities\Content', 'contents_tags');
    }

    public function scopeByTypologyId($query, $typologyId)
    {
        return $typologyId ? $query->whereHas('contents', function($q) use($typologyId) {
            $q->where('typology_id', $typologyId);
        }) : $query;
    }

}
