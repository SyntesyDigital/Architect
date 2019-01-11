<?php

namespace Modules\Architect\Jobs\Typology;

use Modules\Architect\Http\Requests\Typology\UpdateTypologyRequest;
use Modules\Architect\Entities\Typology;
use Modules\Architect\Entities\TypologyAttribut;
use Modules\Architect\Entities\Field;
use Modules\Architect\Entities\Language;

use Modules\Architect\Tasks\Urls\UpdateUrlsTypology;

class UpdateTypology
{
    public function __construct(Typology $typology, $attributes)
    {
        $this->typology = $typology;
        $this->attributes = array_only($attributes, [
            'name',
            'fields',
            'identifier',
            'icon',
            'has_categories',
            'has_tags',
            'has_slug',
            'slug'
        ]);
    }

    public static function fromRequest(Typology $typology, UpdateTypologyRequest $request)
    {
        return new self($typology, $request->all());
    }

    public function handle()
    {
        $this->typology->update([
            'name' => $this->attributes["name"],
            'identifier' => $this->attributes["identifier"],
            'icon' => isset($this->attributes["icon"]) ? $this->attributes["icon"] : null,
            'has_categories' => isset($this->attributes["has_categories"]) ? $this->attributes["has_categories"] : null,
            'has_tags' => isset($this->attributes["has_tags"]) ? $this->attributes["has_tags"] : null,
            'has_slug' => isset($this->attributes["has_slug"]) ? $this->attributes["has_slug"] : null,
        ]);

        $this->typology->fields()->delete();
        $this->typology->attrs()->delete();

        foreach($this->attributes["fields"] as $field) {
            $this->typology->fields()->save(new Field([
                'icon' => $field['icon'],
                'name' => $field['name'],
                'identifier' => $field['identifier'],
                'type' => $field['type'],
                'rules' => isset($field['rules']) ? $field['rules'] : null,
                'settings' => isset($field['settings']) ? $field['settings'] : null,
            ]));
        }

        if(isset($this->attributes["slug"]) && $this->typology->has_slug) {
            foreach($this->attributes["slug"] as $iso => $value) {
                $language = Language::where('iso', $iso)->first();

                if($language) {
                    $this->typology->attrs()->save(new TypologyAttribut([
                        'name' => 'slug',
                        'value' => $value,
                        'language_id' => $language->id
                    ]));
                }
            }
        }

        $this->typology->load('fields', 'attrs');

        (new UpdateUrlsTypology($this->typology))->run();

        return $this->typology;
    }
}
