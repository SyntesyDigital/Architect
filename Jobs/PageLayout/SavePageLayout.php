<?php

namespace Modules\Architect\Jobs\PageLayout;

use Modules\Architect\Http\Requests\PageLayout\SavePageLayoutRequest;
use Modules\Architect\Entities\PageLayout;

use Illuminate\Support\Facades\Schema;

class SavePageLayout
{
    public function __construct($attributes)
    {
        $this->attributes = array_only($attributes, [
            'name',
            'definition',
            'settings'
        ]);
    }

    public static function fromRequest(SavePageLayoutRequest $request)
    {
        return new self($request->all());
    }

    function removeLayoutValues(&$nodes) {
        if($nodes) {
            foreach ($nodes as $key => $node) {
                if(isset($node['children'])) {
                    $nodes[$key]['children'] = $this->removeLayoutValues($node['children']);
                } else {
                    if(isset($node['field'])) {
                        if(isset($nodes[$key]['field']['fields']['value'])) {
                            unset($nodes[$key]['field']['fields']['value']);
                        }
                        unset($nodes[$key]['field']['value']);
                    }
                }
            }
        }
        return $nodes;
    }

    public function handle()
    {
        return PageLayout::create([
            'name' => $this->attributes['name'],
            'definition' => json_encode($this->removeLayoutValues($this->attributes['definition'])),
            'settings' => isset($this->attributes['settings']) ? json_encode($this->attributes['settings']) : null,
        ]);
    }
}
