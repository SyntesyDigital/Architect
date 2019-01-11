<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class Date extends Field implements FieldInterface
{
    public $type = 'date';
    public $icon = 'fa-calendar';
    public $name = 'DATE';

    public $rules = [
        'required'
    ];

    public $settings = [
      'htmlId',
      'htmlClass'
    ];

    public function save($content, $identifier, $values, $languages = null)
    {
        $content->fields()->save(new ContentField([
            'name' => $identifier,
            'value' => strtotime($values),
            'language_id' => null
        ]));

        return true;
    }
}
?>
