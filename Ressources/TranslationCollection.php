<?php

namespace Modules\Architect\Ressources;

use Illuminate\Http\Resources\Json\ResourceCollection;

use Modules\Architect\Transformers\TranslationTransformer;

class TranslationCollection extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
     public function toArray($request)
    {
        print_r($this->collection);
        exit();
        
        return [
            'data' => $this->collection->map(function($translation) use ($request){
                return (new TranslationTransformer($translation))->toArray($request);
            })
        ];
    }


}
