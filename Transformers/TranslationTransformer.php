<?php

namespace Modules\Architect\Transformers;

use Illuminate\Http\Resources\Json\Resource;

class TranslationTransformer extends Resource
{
    public function toArray($request)
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->getFieldValue('name'),
            'value' => $this->resource->getFieldValue('value'),
        ];
    }
}
