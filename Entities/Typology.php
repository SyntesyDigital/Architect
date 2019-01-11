<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

use Modules\Architect\Traits\HasUrl;

class Typology extends Model
{
    use HasUrl;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'typologies';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'icon',
        'identifier',
        'has_categories',
        'has_tags',
        'has_slug'
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


    public function contents()
    {
        return $this->hasMany('\Modules\Architect\Entities\Content');
    }

    public function fields()
    {
        return $this->hasMany('\Modules\Architect\Entities\Field');
    }

    public function attrs()
    {
        return $this->hasMany('\Modules\Architect\Entities\TypologyAttribut');
    }

    public function getIndexField()
    {
        foreach($this->fields as $field) {
            $entryTitle = isset($field->settings["entryTitle"]) ? $field->settings["entryTitle"] : null;

            if($entryTitle === true) {
                return $field->identifier;
            }
        }
        return null;
    }


    public static function whereAttribute($name, $value)
    {
        return self::whereHas('attrs', function ($q) use ($name, $value) {
            $q->where('name', $name);
            $q->where('value', $value);
        });
    }

    public function getSlug($languageId)
    {
        if(!$this->has_slug) {
            return false;
        }

        $attr = $this->attrs
            ->where('name', 'slug')
            ->where('language_id', $languageId)
            ->first();

        return $attr ? $attr->value : null;
    }
}
