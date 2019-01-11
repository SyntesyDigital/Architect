<?php

namespace Modules\Architect\Ressources;

use Illuminate\Http\Resources\Json\ResourceCollection;

use Modules\Architect\Transformers\TagTransformer;

class TagCollection extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
     public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function($tag) use ($request){
                return (new TagTransformer($tag))->toArray($request);
            })
        ];
    }


}
