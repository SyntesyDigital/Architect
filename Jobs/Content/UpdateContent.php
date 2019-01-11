<?php

namespace Modules\Architect\Jobs\Content;

use Modules\Architect\Http\Requests\Content\CreateContentRequest;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Page;
use Modules\Architect\Entities\Category;
use Modules\Architect\Entities\Tag;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;
use Modules\Architect\Entities\Menu;
use Modules\Architect\Tasks\Urls\UpdateUrlsContent;

use Modules\Architect\Fields\FieldConfig;
use Modules\Architect\Fields\Types\Text as TextField;
use Cache;

class UpdateContent
{
     public function __construct(Content $content, $attributes)
     {
         $this->content = $content;
         $this->languages = Language::getAllCached();
         $this->attributes = array_only($attributes, [
             'typology_id',
             'author_id',
             'category_id',
             'parent_id',
             'status',
             'fields',
             'tags',
             'page',
             'translations',
             'is_page',
             'settings'
         ]);
     }

    public static function fromRequest(Content $content, CreateContentRequest $request)
    {
        return new self($content, $request->all());
    }

    public function handle()
    {
        $this->content->update([
            'status' => $this->attributes['status'] ? $this->attributes['status'] : 0,
            'author_id' => $this->attributes['author_id'],
            'is_page' => isset($this->attributes['is_page']) ? $this->attributes['is_page'] : 0,
            'parent_id' => isset($this->attributes['parent_id']) ? $this->attributes['parent_id'] : null,
            'settings' => isset($this->attributes['settings']) ? json_encode($this->attributes['settings']) : null,
        ]);

        $this->saveCategories();
        $this->saveTags();
        $this->saveLanguages();
        $this->saveFields();

        if((isset($this->attributes['is_page'])) && $this->attributes['is_page'] == 1) {
            $this->savePage();
        }

        // RESET CACHE MENU
        $menu = Menu::hasContent($this->content)->first();
        if($menu) {
            Cache::forget(sprintf("menu_%s", $menu->name));
        }

        // Refresh relations
        $this->content->load('fields', 'categories', 'tags', 'languages');

        // Update url
        (new UpdateUrlsContent($this->content))->run();

        // Elasticsearch indexation
        $this->content->index();

        return $this->content;
    }

    // FIXME : Optimize this !!!
    public function getFieldObject($type, $fieldObjects)
    {
        foreach($fieldObjects as $f) {
            if($type == $f["type"]) {
                return new $f['class'];
            }
        }

        return null;
    }

    public function saveFields()
    {
        $fieldObjects = FieldConfig::get();
        $this->content->fields()->delete();

        foreach($this->attributes["fields"] as $field) {
            $values = isset($field["value"]) ? $field["value"] : null;
            $identifier = isset($field["identifier"]) ? $field["identifier"] : null;
            $type = isset($field["type"]) ? $field["type"] : null;

            if($values && $type && $identifier) {

                $_field = $this
                    ->getFieldObject($type, $fieldObjects); // <= Better into FieldObject like FieldHandler ?

                if(!$_field) {
                    throw new \Exception('Field ' . $identifier . ' (type: '.$type.') not exist');
                }

                $_field->save($this->content, $identifier, $values, $this->languages);

                // $this
                //     ->getFieldObject($type, $fieldObjects) // <= Better into FieldObject like FieldHandler ?
                //     ->save($this->content, $identifier, $values, $this->languages);
            }
        }
    }


    public function saveCategories()
    {
        $this->content->categories()->detach();
        $category = isset($this->attributes['category_id']) ? Category::find($this->attributes['category_id']) : null;

        if($category) {
            $this->content->categories()->attach($category);
        }
    }

    public function saveLanguages()
    {
        $this->content->languages()->detach();

        if(isset($this->attributes['translations'])) {
            foreach($this->attributes['translations'] as $iso => $value) {
                $language = $value ? Language::where('iso', $iso)->first() : null;

                if($language) {
                    $this->content->languages()->attach($language);
                }
            }
        }
    }

    public function saveTags()
    {
        $this->content->tags()->detach();
        $tags = isset($this->attributes['tags']) ? Tag::whereIn('id', collect($this->attributes['tags'])->pluck('id')->toArray())->get() : null;

        if($tags) {
            $this->content->tags()->attach($tags);
        }

        $this->content->load('tags');
    }

    function savePageBuilderFields(&$nodes) {

        if($nodes) {
            foreach ($nodes as $key => $node) {
                if(isset($node['children'])) {
                    $nodes[$key]['children'] = $this->savePageBuilderFields($node['children']);
                } else {
                    if(isset($node['field'])) {
                        $field = $node['field'];
                        $type = isset($field['type']) ? $field['type'] : null;

                        switch($type) {
                            case "widget":
                                $fieldName = uniqid('pagewidget_');
                                $fields = isset($field['fields']) ? $field['fields'] : null;

                                (new $field['class'])->save($this->content, $fieldName, $fields);

                                $nodes[$key]['field']['fieldname'] = $fieldName;
                                unset($nodes[$key]['field']['fields']);
                                unset($nodes[$key]['field']['value']);
                            break;

                            case "widget-list":
                                $widgets = isset($field['value']) ? $field['value'] : null;
                                if($widgets){
                                    foreach($widgets as $k => $widget) {
                                        $fieldName = uniqid('pagewidget_');
                                        $fields = isset($widget['fields']) ? $widget['fields'] : null;
                                        $nodes[$key]['field']['value'][$k]['fieldname'] = $fieldName;

                                        (new $widget['class'])->save($this->content, $fieldName, $fields);

                                        foreach($widget["fields"] as $k2 => $v) {
                                            if(isset($nodes[$key]['field']['value'][$k]["fields"][$k2]["value"])) {
                                                unset($nodes[$key]['field']['value'][$k]["fields"][$k2]["value"]);
                                            }
                                        }
                                    }
                                }
                            break;

                            default:
                                $fieldName = uniqid('pagefield_');
                                $fieldValue = isset($field['value']) ? $field['value'] : null;

                                (new $field['class'])->save($this->content, $fieldName, $fieldValue, $this->languages);

                                $nodes[$key]['field']['fieldname'] = $fieldName;
                                unset($nodes[$key]['field']['value']);
                            break;
                        }

                    }
                }
            }
        }

        return $nodes;
    }


    public function savePage()
    {
        $this->content->fields()->delete();
        $this->content->page()->delete();

        foreach($this->attributes["fields"] as $field) {
            $fieldValue = isset($field['value']) ? $field['value'] : null;
            (new TextField)->save($this->content, $field["identifier"], $fieldValue, $this->languages);
        }

        return Page::create([
            'definition' => json_encode($this->savePageBuilderFields($this->attributes['page'])),
            'content_id' => $this->content->id
        ]);
    }
}
