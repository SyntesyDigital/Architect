<?php

namespace Modules\Architect\Jobs\Menu;

use Modules\Architect\Http\Requests\Menu\DeleteMenuRequest;
use Modules\Architect\Entities\Menu;

use Illuminate\Support\Facades\Schema;
use Cache;

class DeleteMenu
{
    public function __construct(Menu $menu)
    {
        $this->menu = $menu;
    }

    public static function fromRequest(Menu $menu, DeleteMenuRequest $request)
    {
        return new self($menu);
    }

    public function handle()
    {
        Cache::forget(sprintf("menu_%s", $this->menu->name));
        return $this->menu->delete();
    }
}
