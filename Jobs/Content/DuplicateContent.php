<?php

namespace Modules\Architect\Jobs\Content;

use Modules\Architect\Http\Requests\Content\DuplicateContentRequest;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentTag;

use Modules\Architect\Tasks\Urls\CreateUrlsContent;

use Illuminate\Support\Facades\Schema;
use Auth;

class DuplicateContent
{
    public function __construct(Content $content)
    {
        $this->content = $content;
    }

    public static function fromRequest(Content $content, DuplicateContentRequest $request)
    {
        return new self($content);
    }

    public function handle()
    {
        $this->content->load(
            'fields',
            'page',
            'tags',
            'languages',
            'categories'
        );

        $content = $this->content->replicate();
        $content->push();

        // Page
        if($this->content->page) {
            $content->page()->create([
                'content_id' => $content->id,
                'definition' => $this->content->page->definition
            ]);
        }

        // Fields
        if($this->content->fields) {
            foreach($this->content->fields as $field){
                unset($field->id);

                switch($field->name) {
                    case 'slug':
                        $field->value = $field->value . '-' . $content->id;
                    break;

                    case 'title':
                        $field->value = $field->value . ' (duplicated) ';
                    break;
                }

                $content->fields()->create($field->toArray());
            }
        }

        // Tags
        if($this->content->tags) {
            $content->tags()->attach($this->content->tags->pluck('id')->toArray());
        }

        // Languages
        if($this->content->languages) {
            $content->languages()->attach($this->content->languages->pluck('id')->toArray());
        }

        // Categories
        if($this->content->categories) {
            $content->categories()->attach($this->content->categories->pluck('id')->toArray());
        }

        $content->update([
            'status' => Content::STATUS_DRAFT,
            'author_id' => Auth::user()->id,
            'parent_id' => $this->content->parent_id
        ]);

        // Create Url Content
        (new CreateUrlsContent($content))->run();

        // Index or reindex content on elasticsearch
        $content->index();

        return $content;
    }
}
