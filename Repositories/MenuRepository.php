<?php

namespace Modules\Architect\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;

use DataTables;
use Storage;
use Lang;

use Modules\Architect\Entities\Menu;
use Modules\Architect\Entities\MenuElement;
use Modules\Architect\Entities\MenuElementField;
use Modules\Architect\Entities\Language;

class MenuRepository extends BaseRepository
{
    public function model()
    {
        return "Modules\\Architect\\Entities\\Menu";
    }

    public function getDatatable($options = [])
    {
        return Datatables::of(Menu::all())
            ->addColumn('action', function ($item) {
                return '
                <a href="'.route('menu.show', $item).'" class="btn btn-link toogle-edit" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> '.Lang::get("architect::datatables.edit").'</a> &nbsp;
                <a href="#" class="btn btn-link text-danger" data-toogle="delete" data-ajax="' . route('menu.delete', $item) . '" data-confirm-message="'.Lang::get('architect::datatables.sure').'"><i class="fa fa-trash"></i> '.Lang::get("architect::datatables.delete").'</a> &nbsp;
                ';
            })
            ->make(true);
    }


    public function getDisplayTree($menu)
    {
        $menuElements = $menu->elements()->orderBy('order', 'ASC')->get();
        $languages = Language::getAllCached();
        $tree = [];

        $traverse = function ($elements) use (&$traverse, $languages) {
            $tree = [];
            foreach ($elements as $element) {
                $tree[] = [
                    "id" => $element->id,
                    "link" => $element->getFieldValues('link', 'link', $languages),
                    "name" =>  $element->getFieldValues('link.title', 'text', $languages),
                    "parent_id" => $element->parent_id,
                    "settings" => json_decode($element->settings,true),
                    "children" => $element->children ? $traverse($element->children) : null,
                ];
            }

            return $tree;
        };

        foreach ($menuElements as $element) {
            if (!$element->parent_id) {

              $tree[] = [
                  "id" => $element->id,
                  "link" => $element->getFieldValues('link', 'link', $languages),
                  "name" =>  $element->getFieldValues('link.title', 'text', $languages),
                  "parent_id" => $element->parent_id,
                  "settings" => json_decode($element->settings,true),
                  "children" => $element->children ? $traverse( MenuElement::getTree($element->id)) : null,
              ];

            }
        }

        return $tree;

    }


    public function getElementTree($menu)
    {
        $menuElementsTree = array();
        $languages = Language::getAllCached();
        $defaultLanguage = Language::getDefault();
        $level = 1;

        $traverse = function (&$menuElementsTree, $menuElements, $level) use (&$traverse, $languages, $defaultLanguage) {
            $level++;

            foreach ($menuElements as $menuElement) {
                array_push($menuElementsTree, array(
                    "name" => $menuElement->getFieldValue('link.title',$defaultLanguage->id),
                    "id" => $menuElement->id,
                    "parent_id" => $menuElement->parent_id,
                    "order" => $menuElement->order,
                    "level" => $level,
                    "field" => [
                        "id" => $menuElement->id,
                        "identifier" => "link",
                        "type" => "link",
                        "value" => $menuElement->getFieldValues('link', 'link', $languages),
                        "name" => "Enllaç",
                        "settings" => json_decode($menuElement->settings),
                    ],
                ));

                $traverse($menuElementsTree, $menuElement->children, $level);
            }
        };

        $menuElements = $menu->elements()->orderBy('order', 'ASC')->get();

        foreach ($menuElements as $menuElement) {
            if (!$menuElement->parent_id) {
                array_push($menuElementsTree, array(
                    //"name" => $menuElement->getFieldValue('title'),
                    "name" => $menuElement->getFieldValue('link.title',$defaultLanguage->id),
                    "id" => $menuElement->id,
                    "parent_id" => $menuElement->parent_id,
                    "order" => $menuElement->order,
                    "level" => $level,
                    "field" => [
                        "id" => $menuElement->id,
                        "identifier" => "link",
                        "type" => "link",
                        "value" => $menuElement->getFieldValues('link', 'link', $languages),
                        "name" => "Enllaç",
                        "settings" => json_decode($menuElement->settings),
                    ],
                ));

                //all parents
                $traverse($menuElementsTree, MenuElement::getTree($menuElement->id), $level);
            }
        }

        return $menuElementsTree;
    }
}
