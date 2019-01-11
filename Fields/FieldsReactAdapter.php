<?php

namespace Modules\Architect\Fields;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;

use Modules\Architect\Entities\Media;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Typology;
use Modules\Architect\Entities\Language;
use Modules\Architect\Fields\FieldConfig;

class FieldsReactAdapter
{
    private $fields = [];
    private $typology = null;
    private $content = null;

    public function __construct($object)
    {
        if(get_class($object) == "Modules\Architect\Entities\Typology") {
            $this->typology = $object->load('fields');
        }

        if(get_class($object) == "Modules\Architect\Entities\Content") {
            $this->content = $object->load('fields');
        }

        $this->languages = Language::getAllCached();
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

    /*
    *   Build and fill typology fields list with content
    */
    public function get()
    {
        if($this->content) {
            $fields = $this->content->typology->fields;
        }

        if($this->typology) {
            $fields = $this->typology->fields;
        }

        foreach($fields as &$typologyField) {
            if($this->content) {
                foreach($this->content->fields as $k => $contentField) {
                    if($typologyField->identifier == $contentField->name) {
                        $this->build($typologyField, $contentField);
                    }
                }
            }

            if(!isset($typologyField->value)) {
                $typologyField->value = null;
                $this->fields[$typologyField->identifier] = $typologyField;
            }
        }

        return new EloquentCollection($this->fields);
    }



    private function build($typologyField, $contentField)
    {
        switch($typologyField->type) {
            // Translatable fields
            case 'richtext':
            case 'slug':
            case 'text':
                $iso = $this->getLanguageIsoFromId($contentField->language_id);
                $values = isset($this->fields[$typologyField->identifier]) ? $this->fields[$typologyField->identifier]->value : null;

                if($values) {
                    $values[$iso] = $contentField->value;
                } else {
                    $values = [
                        $iso => $contentField->value
                    ];
                }

                $typologyField->value = $values;
            break;

            case 'localization':
                $typologyField->value = json_decode($contentField->value, true);
            break;

            case 'file':
            case 'image':
                $typologyField->value = Media::find($contentField->value);
            break;

            case 'translated_file':
                $iso = $this->getLanguageIsoFromId($contentField->language_id);
                $values = isset($this->fields[$typologyField->identifier]) ? $this->fields[$typologyField->identifier]->value : null;

                if($values) {
                    $values[$iso] = Media::find($contentField->value);
                } else {
                    $values = [
                        $iso => Media::find($contentField->value)
                    ];
                }

                $typologyField->value = $values;
            break;

            case 'images':
                $values = isset($typologyField->value) ? $typologyField->value : null;
                $values[] = Media::find($contentField->value);

                $typologyField->value = $values;
            break;

            case 'date':
                $typologyField->value = date('Y-m-d H:i:s', $contentField->value);
            break;

            case 'contents':
                $values = isset($typologyField->value) ? $typologyField->value : [];
                $values[] = Content::find($contentField->value)->load('fields');
                $typologyField->value = $values;
            break;

            case 'url':
            case 'link':
                $values = null;
                $childs = $this->content->getFieldChilds($contentField);

                if($childs != null){
                  foreach($childs as $k => $v) {
                      if($v->language_id) {
                          $iso = $this->getLanguageIsoFromId($v->language_id);
                          $values[ explode('.', $v->name)[1] ][$iso] = $v->value;
                      } else {
                          if(explode('.', $v->name)[1] == 'content') {
                              $values[ explode('.', $v->name)[1] ] = Content::find($v->value);
                          }
                      }
                  }
                }



                $typologyField->value = $values;
            break;

            case 'key_values':
                $values = null;

                $childs = $this->content->getFieldChilds($contentField);

                if($childs != null){
                  foreach($childs as $k => $v) {
                    $values[explode('.', $v->name)[1]][ explode('.', $v->name)[2] ] = $v->value;
                  }
                }

                $typologyField->value = $values;

            break;

            case 'video':
                $values = null;
                $childs = $this->content->getFieldChilds($contentField);

                if($childs != null){
                  foreach($childs as $k => $v) {
                      if($v->language_id) {
                          $iso = $this->getLanguageIsoFromId($v->language_id);
                          $values[ explode('.', $v->name)[1] ][$iso] = $v->value;
                      }
                  }
                }

                $typologyField->value = $values;
            break;

            default:
                $values = isset($typologyField->value) ? $typologyField->value : $contentField->value;

                if($values && !is_array($values)) {
                    $values = [$values];
                    $values[] = $contentField->value;
                }

                $typologyField->value = $contentField->value;
            break;
        }

        $this->fields[$typologyField->identifier] = $typologyField;
    }



}
?>
