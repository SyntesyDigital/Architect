<?php

namespace Modules\Architect\Jobs\Menu;

use Modules\Architect\Http\Requests\Menu\CreateMenuRequest;
use Modules\Architect\Entities\Menu;
use Modules\Architect\Entities\MenuElement;
use Modules\Architect\Entities\MenuElementField;
use Modules\Architect\Entities\Language;

class CreateMenu
{
    public function __construct($attributes)
    {
        $this->languages = Language::getAllCached();
        $this->attributes = array_only($attributes, [
            'name',
            'fields',
            'settings'
        ]);
        $this->languages = Language::getAllCached()->pluck('id','iso');
    }

    public static function fromRequest(CreateMenuRequest $request)
    {
        return new self($request->all());
    }

    private function saveField($field,$order,$parent_id)
    {
        $name = "link";
        $values = $field["value"];

        // Save father field
        $menuField = MenuElement::create([
            'menu_id' => $this->menu->id,
            //'parent_id' => $parent_id,
            'order' => $order,
            //'settings' => json_encode($field["settings"])
        ]);

        $menuElementField = $menuField->fields()->save(new MenuElementField([
            'name' => $name,
            'value' => '',
        ]));

        // Save TITLE child fields
        if(isset($values['title'])) {
            foreach($values['title'] as $iso => $value) {

                $menuField->fields()->save(new MenuElementField([
                    'name' => $name  . '.title',
                    'value' => $value,
                    'language_id' => $this->languages[$iso],
                    'parent_id' => $menuElementField->id
                ]));
            }
        }

        // Save URL child fields
        if(isset($values['url'])) {
            foreach($values['url'] as $iso => $value) {
                $menuField->fields()->save(new MenuElementField([
                    'name' => $name  . '.url',
                    'value' => $value,
                    'language_id' => $this->languages[$iso],
                    'parent_id' => $menuElementField->id
                ]));
            }
        }

        // Save CONTENT child field
        $contentId = (isset($values['content'])) && isset($values['content']['id'])
            ? $values['content']['id']
            : null;

        if($contentId) {
            $menuField->fields()->save(new MenuElementField([
                'name' => $name  . '.content',
                'value' => $contentId,
                'parent_id' => $menuElementField->id,
                'relations' => 'contents'
            ]));
        }

        $menuField->parent_id = $parent_id;
        $menuField->settings = json_encode($field["settings"]);
        $menuField->save();

        return $menuField;
    }

    public function handle()
    {
        $this->menu = Menu::create([
            'name' => $this->attributes['name'] ? $this->attributes['name'] : null,
            'settings' => isset($this->attributes['settings']) ? json_encode($this->attributes['settings']) : null,
        ]);

        $fields = $this->attributes['fields'];
        $order = 1;

        $traverse = function ($parent_id,$children) use (&$traverse) {

    				$order = 1;

    				foreach ($children as $menuItem) {

    					$field = json_decode($menuItem['field'],true);
              $menuField = $this->saveField($field,$order,$parent_id);

    					$order++;

    					if(isset($menuItem['children'])){
    						$children = $menuItem['children'][0];

    						$traverse($menuField->id,$children);
    					}
            }
    	  };

        $traverse(null,$fields[0]);

        return $this->menu;
    }

}
