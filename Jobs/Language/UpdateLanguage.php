<?php

namespace Modules\Architect\Jobs\Language;

use Modules\Architect\Http\Requests\Language\UpdateLanguageRequest;

use Modules\Architect\Entities\Language;

class UpdateLanguage
{
    public function __construct(Language $language,$attributes)
    {
        $this->language = $language;

        $this->attributes = array_only($attributes, [
            'name',
            'iso',
            'default'
        ]);
    }

    public static function fromRequest(Language $language,UpdateLanguageRequest $request)
    {
        return new self($language,$request->all());
    }

    public function handle()
    {
        if(isset($this->attributes['default']) && $this->attributes['default'] == "on"){
          $this->attributes['default'] = 1;
          //check all default to null
          Language::where('default',1)->update(['default' => null]);
        }
        else {
          $this->attributes['default'] = null;
        }

        $this->language->update($this->attributes);

        return $this->language;
    }
}
