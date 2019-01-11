<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

class Video extends Field implements FieldInterface
{
    public $type = 'video';
    public $icon = 'fa-video-camera';
    public $name = 'VIDEO';

    public $rules = [
        'required'
    ];

    public $settings = [
      'htmlId',
      'htmlClass'
    ];

    public function validate($request)
    {}

      public function save($content, $identifier, $values, $languages = null)
      {
          $languages = Language::getAllCached();

          // Save father field
          $field = ContentField::create([
              'name' => $identifier,
              'value' => '',
              'content_id' => $content->id
          ]);

          if(!$field) {
              return false;
          }

          // Save TITLE child fields
          if(isset($values['title'])) {
              foreach($values['title'] as $iso => $value) {
                  $language = $this->getLanguageFromIso($iso, $languages);

                  $content->fields()->save(new ContentField([
                      'name' => $identifier . '.title',
                      'value' => $value,
                      'language_id' => isset($language->id) ? $language->id : null,
                      'parent_id' => $field->id
                  ]));
              }
          }

          // Save URL child fields
          if(isset($values['url'])) {
              foreach($values['url'] as $iso => $value) {
                  $language = $this->getLanguageFromIso($iso, $languages);

                  $content->fields()->save(new ContentField([
                      'name' => $identifier . '.url',
                      'value' => $value,
                      'language_id' => isset($language->id) ? $language->id : null,
                      'parent_id' => $field->id
                  ]));
              }
          }

          return true;
      }

}
?>
