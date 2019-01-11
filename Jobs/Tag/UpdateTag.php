<?php

namespace Modules\Architect\Jobs\Tag;

use Modules\Architect\Http\Requests\Tag\UpdateTagRequest;

use Modules\Architect\Entities\Tag;
use Modules\Architect\Entities\TagField;
use Modules\Architect\Entities\Language;

class UpdateTag
{
    public function __construct(Tag $tag, $attributes)
    {
        $this->tag = $tag;

        $fields = collect(Tag::FIELDS)
            ->keyBy('identifier')
            ->keys()
            ->toArray();

        $this->attributes = array_only($attributes['fields'], $fields);
    }

    public static function fromRequest(Tag $tag, UpdateTagRequest $request)
    {
        return new self($tag, $request->all());
    }

    public function handle()
    {
        $this->tag->fields()->delete();

        foreach($this->attributes as $identifier => $field) {
            foreach($field as $languageId => $value) {
                $this->tag->fields()->save(new TagField([
                    'name' => $identifier,
                    'value' => is_array($value) ? json_encode($value) : $value,
                    'language_id' => $languageId
                ]));
            }
        }

        return $this->tag;
    }
}
