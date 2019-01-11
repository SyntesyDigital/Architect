<?php

namespace Modules\Architect\Fields;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;

use Modules\Architect\Entities\Media;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Page;
use Modules\Architect\Entities\Language;
use Modules\Architect\Fields\FieldConfig;

class FieldsReactPageBuilderAdapter
{
    public function __construct(Content $content)
    {
        $this->content = $content;
        $this->page = $content->page;
        $this->languages = Language::getAllCached();
    }

    public function get()
    {
        if(!$this->page) {
            return null;
        }

        $nodes = json_decode($this->page->definition, true);
        return $this->getPage($nodes);
    }

    private function getLanguageIsoFromId($id)
    {
        foreach($this->languages as $language) {
            if($language->id == $id) {
                return $language->iso;
            }
        }

        return false;
    }

    function getPage(&$nodes) {
        if($nodes) {
            foreach ($nodes as $key => $node) {
                if(isset($node['children'])) {
                    $nodes[$key]['children'] = $this->getPage($node['children']);
                } else {
                    if(isset($node['field'])) {
                        $nodes[$key]['field']['fieldname'] = $nodes[$key]['field']['name'];
                        //$nodes[$key]['field']['name'] = $node['field']['type'];

                        switch($nodes[$key]['field']['type']) {
                            case "widget-list":
                                $nodes[$key]['field']['value'] = $this->buildPageField($node['field']);
                            break;

                            case "widget":
                                $nodes[$key]['field']['fields'] = $this->buildPageField($node['field']);
                            break;

                            default:
                                $nodes[$key]['field']['value'] = $this->buildPageField($node['field']);
                        }
                    }
                }
            }
        }

        return $nodes;
    }

    private function processContent($contentId) {
      $content = Content::find($contentId);

      $data = [
        "id" => $content->id,
        "title" => $content->title
      ];

      if(!$content->is_page){
        $data["typology"] = [
          "id" => $content->typology->id,
          "name" => $content->typology->name,
          "icon" => $content->typology->icon
        ];
      }

      return $data;

    }

    private function buildPageField($field, $name = null)
    {
        $fieldName = isset($field['fieldname']) ? $field['fieldname'] : null;

        if($name) {
            $fieldName = $name;
        }

        switch($field["type"]) {
            case 'richtext':
            case 'slug':
            case 'text':
                return ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->get()
                    ->mapWithKeys(function($field) {
                        return [$field->language->iso => $field->value];
                    })
                    ->toArray();
            break;

            case 'file':
            case 'image':
                $contentField = ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->first();

                if($contentField != null){
                    return Media::find($contentField->value);
                }
            break;

            case 'translated_file':
                return ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->get()
                    ->mapWithKeys(function($field) {
                        return [$field->language->iso => Media::find($field->value)];
                    })
                    ->toArray();
            break;

            case 'date':
                $contentField = ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->first();

                return date('Y-m-d H:i:s', $contentField->value);
            break;

            case 'localization':
                $contentField = ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->first();

                if($contentField != null){
                  return json_decode($contentField->value, true);
                }
            break;

            case 'images':
                return ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->get()
                    ->map(function($field){
                        return Media::find($field->value);
                    })
                    ->toArray();
            break;

            case 'contents':
                return ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->get()
                    ->map(function($field){
                        return $this->processContent($field->value);
                    })
                    ->toArray();
            break;

            case 'video':
                $field = ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->first();

                $values = null;

                if($field) {
                    $childs = $this->content->getFieldChilds($field);

                    if($childs != null){
                      foreach($childs as $k => $v) {
                          if($v->language_id) {
                              $iso = $this->getLanguageIsoFromId($v->language_id);
                              $values[ explode('.', $v->name)[1] ][$iso] = $v->value;
                          }
                      }
                    }
                }
                return $values;
            break;

            case 'link':
                $field = ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->first();

                $values = null;

                if($field) {
                    $childs = $this->content->getFieldChilds($field);

                    if($childs != null){
                      foreach($childs as $k => $v) {
                          if($v->language_id) {
                              $iso = $this->getLanguageIsoFromId($v->language_id);
                              $values[ explode('.', $v->name)[1] ][$iso] = $v->value;
                          } else {
                              if(explode('.', $v->name)[1] == 'content') {
                                  $values[ explode('.', $v->name)[1] ] = $this->processContent($v->value);
                              }
                          }
                      }
                    }
                }
                return $values;
            break;

            case 'widget':
                if(class_exists($field['class'])) {
                    $widget = (new $field['class']);
                    $fields = [];
                    foreach($widget->fields as $_field) {
                        if(!isset($_field['value'])) {
                            $_field['value'] = [];
                        }

                        $fieldName = $field['fieldname'] . "_" . $_field['identifier'];
                        $_field["value"] = $this->buildPageField($_field, $fieldName);
                        $fields[] = $_field;
                    }
                    return $fields;
                }
            break;


            case 'widget-list':
                if(!isset($field["value"])) {
                    return null;
                }

                foreach($field["value"] as $k => $w) {
                    if(class_exists($w['class'])) {
                        $widget = (new $w['class']);
                        $fields = [];
                        foreach($widget->fields as $_field) {
                            if(!isset($_field['value'])) {
                                $_field['value'] = [];
                            }

                            $fieldName = $w['fieldname'] . "_" . $_field['identifier'];
                            $_field["value"] = $this->buildPageField($_field, $fieldName);
                            $fields[] = $_field;
                        }
                        $field["value"][$k]["fields"] = $fields;
                    }
                }

                return $field["value"];
            break;

            default:
                $fields = ContentField::where('name', $fieldName)
                    ->where('content_id', $this->content->id)
                    ->first();

                return $fields ? $fields->value : null;
            break;
        }

        return null;
    }

}
?>
