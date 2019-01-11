<?php

namespace Modules\Architect\Jobs\Content;

use Modules\Architect\Http\Requests\Content\PublishContentRequest;
use Modules\Architect\Entities\Content;
use Carbon\Carbon;

class PublishContent
{

    public function __construct(Content $content, $attributes)
    {
        $this->content = $content;
        $this->attributes = array_only($attributes, [
            'status'
        ]);
    }

    public static function fromRequest(Content $content, PublishContentRequest $request)
    {
        return new self($content, $request->all());
    }

    public function handle()
    {
        return $this->content->update([
            'status' => $this->attributes['status'],
            'published_at' => $this->attributes['status'] == 1 ? Carbon::now() : null
        ]);
    }

}
