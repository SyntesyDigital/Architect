<?php

namespace Modules\Architect\Jobs\Language;

use Modules\Architect\Http\Requests\Language\DeleteLanguageRequest;
use Modules\Architect\Entities\Language;

class DeleteLanguage
{
    public function __construct(Language $language)
    {
        $this->language = $language;
    }

    public static function fromRequest(Language $language, DeleteLanguageRequest $request)
    {
        return new self($language);
    }

    public function handle()
    {
        return $this->language->delete();
    }
}
