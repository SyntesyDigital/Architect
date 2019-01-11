<?php

namespace Modules\Architect\Jobs\Tag;

use Modules\Architect\Http\Requests\Tag\DeleteTagRequest;
use Modules\Architect\Entities\Tag;

class DeleteTag
{
    public function __construct(Tag $tag)
    {
        $this->tag = $tag;
    }

    public static function fromRequest(Tag $tag, DeleteTagRequest $request)
    {
        return new self($tag);
    }

    public function handle()
    {
        return $this->tag->delete();
    }
}
