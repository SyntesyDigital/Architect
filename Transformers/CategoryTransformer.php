<?php

namespace Modules\Architect\Transformers;

use Illuminate\Http\Resources\Json\Resource;

use Modules\Architect\Transformers\ContentTransformer;
use Modules\Architect\Ressources\CategoryTreeCollection;
use Modules\Architect\Entities\Language;

class CategoryTransformer extends Resource
{
    public function toArray($request, $language = null, $recursive = false)
    {
        $languageId = $language ? $language->id : null;

        if($request->get('accept_lang')) {
            $language = Language::byIso($request->get('accept_lang'))->first();
            $languageId = $language ? $language->id : null;
        }

        $data = [
            'id' => $this->id,
            'name' => $this->getFieldValue('name', $languageId),
            'slug' => $this->getFieldValue('slug', $languageId),
            'description' => $this->getFieldValue('description', $languageId)
        ];

        if($request->get('loads')) {
            if(in_array('contents', explode(',',$request->get('loads')))) {
                $data['contents'] = $this->contents->map(function($content) use ($request){
                    return (new ContentTransformer($content))->toArray($request);
                })->toArray();
            }

            if(in_array('descendants', explode(',',$request->get('loads')))) {
                $data['descendants'] = $this->descendants->map(function($category) use ($request){
                    return (new self($category))->toArray($request);
                })->toArray();
            }
        }

        return $data;
    }
}
