<?php

namespace Modules\Architect\Jobs\Translation;

use Modules\Architect\Http\Requests\Translation\DeleteTranslationRequest;
use Modules\Architect\Entities\Translation;
use Modules\Architect\Entities\Language;
use Cache;

class DeleteTranslation
{
    public function __construct(Translation $translation)
    {
        $this->translation = $translation;
    }

    public static function fromRequest(Translation $translation, DeleteTranslationRequest $request)
    {
        return new self($translation);
    }

    public function handle()
    {
        // OPTIMIZE : create task for it :)
        foreach(Language::getAllCached() as $language) {
            Cache::forget('localization.' . $language->iso);
        }

        return $this->translation->delete();
    }
}
