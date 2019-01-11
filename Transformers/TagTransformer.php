<?php

namespace Modules\Architect\Transformers;

use Illuminate\Http\Resources\Json\Resource;

use Modules\Architect\Entities\Language;

class TagTransformer extends Resource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request, $language = null)
    {
        //$languages = Language::getAllCached();
        $languageId = $language ? $language->id : null;

        if($request->get('accept_lang')) {
            $language = Language::byIso($request->get('accept_lang'))->first();
            $languageId = $language ? $language->id : null;
        }

        return [
            'id' => $this->resource->id,
            'name' => $this->resource->getFieldValue('name', $languageId),
            'slug' => $this->resource->getFieldValue('slug', $languageId),
            'description' => $this->resource->getFieldValue('description', $languageId),
        ];
    }





}
