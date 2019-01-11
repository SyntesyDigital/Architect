<?php

namespace Modules\Architect\Transformers;

use Illuminate\Http\Resources\Json\Resource;

use Modules\Architect\Entities\Media;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Typology;
use Modules\Architect\Entities\Language;

// FIXME : move this or find a better way :)
use Modules\Turisme\Adapters\PageBuilderAdapter;

use Modules\Architect\Transformers\TagTransformer;
use Modules\Architect\Transformers\CategoryTransformer;

class ContentTransformer extends Resource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request, $language = null, $loadFields = true)
    {
        // FIXME : find a better way
        $languages = Language::getAllCached();

        $data = [
            'id' => $this->resource->id,
            'title' => $this->resource->getTitleAttribute($language),
            'fields' => $loadFields ? $this->getFields($languages) : null,
            'is_page' => boolval($this->resource->is_page),
            'page' => ($loadFields && $this->resource->is_page) ? $this->getPage($languages) : null,
            'typology' => !$this->resource->is_page ? $this->resource->typology->toArray() : null,
            'slug' => $this->resource->getFullSlug(),
            'url' => $this->resource->getUrlAttribute($language)
        ];

        if($request->get('loads')) {
            if(in_array('tags', explode(',',$request->get('loads')))) {
                $data['tags'] = $this->resource->tags->map(function($tag) use ($request, $language){
                    return (new TagTransformer($tag))->toArray($request, $language);
                })->toArray();
            }

            if(in_array('category', explode(',',$request->get('loads')))) {
                $data['category'] = $this->resource->categories->map(function($category) use ($request, $language){
                    return (new CategoryTransformer($category))->toArray($request, $language);
                })->first();
            }
        }

        return $data;
    }

    private function getFields($languages)
    {
        if(!$this->resource->fields) {
            return null;
        }

        $fields = [];
        if($this->resource->typology) {
            foreach($this->resource->typology->fields as $field) {
                $field->values = $this->resource->getFieldValues(
                    $field->identifier,
                    $field->type,
                    $languages
                );
                $fields[$field->identifier] = $field->toArray();
            }
        } else {
            $fields['title'] = $this->resource->getFieldValues(
                'title',
                'text',
                $languages
            );

            $fields['slug'] = $this->resource->getFieldValues(
                'slug',
                'text',
                $languages
            );
        }

        return $fields;
    }

    private function getPage($languages)
    {
        return (new PageBuilderAdapter($this->resource, $languages))->get();
    }

}
