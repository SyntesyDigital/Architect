<?php

namespace Modules\Architect\Jobs\Translation;

use Modules\Architect\Http\Requests\Translation\UpdateTranslationRequest;

use Modules\Architect\Entities\Translation;
use Modules\Architect\Entities\TranslationField;
use Modules\Architect\Entities\Language;
use Cache;

class UpdateTranslation
{
    public function __construct(Translation $translation,$attributes)
    {
        $this->translation = $translation;

        $this->attributes = array_only($attributes, [
          'name',
          'fields'
        ]);
    }

    public static function fromRequest(Translation $translation,UpdateTranslationRequest $request)
    {
        return new self($translation,$request->all());
    }

    public function handle()
    {
        $this->translation->fields()->delete();

        $this->translation->update([
          "name" => $this->attributes['name']
        ]);

        foreach($this->attributes['fields']['value'] as $languageId => $value) {
            $this->translation->fields()->save(new TranslationField([
                'translation_id' => $this->translation->id,
                'name' => $this->attributes['name'],
                'value' => is_array($value) ? json_encode($value) : $value,
                'language_id' => $languageId
            ]));
        }

        // OPTIMIZE : create task for it :)
        foreach(Language::getAllCached() as $language) {
            Cache::forget('localization.' . $language->iso);
        }

        return $this->translation;
    }
}
