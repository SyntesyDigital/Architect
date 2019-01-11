<?php

namespace Modules\Architect\Ressources;

use Illuminate\Http\Resources\Json\ResourceCollection;

use Modules\Architect\Transformers\ContentTransformer;
use Modules\Architect\Entities\Language;

class ContentCollection extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request, $loadFields = true, $options = [])
    {
        $language = $request->get('accept_lang') ? Language::byIso($request->get('accept_lang'))->first() : Language::getDefault();

        return [
            'data' => $this->collection->map(function($content) use ($request, $language, $loadFields){
                return (new ContentTransformer($content, $loadFields))->toArray($request, $language, $loadFields);
            })
        ];
    }
}
