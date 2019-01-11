<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

use Modules\Architect\Traits\HasFields;
use Modules\Architect\Entities\Language;

use Illuminate\Database\Eloquent\Builder;

class Translation extends Model
{
    use HasFields;

    protected $fieldModel = 'Modules\Architect\Entities\TranslationField';

    protected $table = 'translations';

    const FIELDS = [
        [
            'name' => 'Traducció',
            'identifier' => 'value',
            'type' => 'text',
            'required' => true
        ]
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
          'name',
          'order'
    ];

    public function getDefaultValueAttribute()
    {
        $defaultLanguage = Language::getDefault();
        $defaultLanguageId = isset($defaultLanguage->id) ? $defaultLanguage->id : null;

        return $this->getFieldValue($this->name, $defaultLanguageId);
    }

    public function scopeByLanguageIso(Builder $query, $iso)
    {
        $language = Language::byIso($iso)->first();
        return $language ? $query->whereHas('fields', function($q) use($language) {
            $q->where('language_id', $language->id);
        }) : $query;
    }


}
