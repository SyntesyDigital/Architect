<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class KeyValues extends Field implements FieldInterface
{
    public $type = 'key_values';
    public $icon = 'fa-key';
    public $name = 'KEY_VALUES';

    public $rules = [];

    public $settings = [];

    public function save($content, $identifier, $values, $languages = null)
    {

        if(isset($values) && sizeof($values) > 0){

          $field = ContentField::create([
              'name' => $identifier,
              'value' => '',
              'content_id' => $content->id
          ]);

          foreach($values as $index => $value) {

              $name = isset($value['name']) ? $value['name'] : null;
              $key = isset($value['identifier']) ? $value['identifier'] : null;
              $value = isset($value['value']) ? $value['value'] : null;

              if($name) {
                  $content->fields()->save(new ContentField([
                      'name' => $identifier . '.'.$index.'.name',
                      'value' => $name,
                      'parent_id' => $field->id
                  ]));
              }
              if($key) {
                  $content->fields()->save(new ContentField([
                      'name' => $identifier . '.'.$index.'.identifier',
                      'value' => $key,
                      'parent_id' => $field->id
                  ]));
              }
              if($value) {
                  $content->fields()->save(new ContentField([
                      'name' => $identifier . '.'.$index.'.value',
                      'value' => $value,
                      'parent_id' => $field->id
                  ]));
              }
              else {
                $content->fields()->save(new ContentField([
                    'name' => $identifier . '.'.$index.'.value',
                    'value' => 0,
                    'parent_id' => $field->id
                ]));
              }
          }

        }

        return true;
    }
}
?>
