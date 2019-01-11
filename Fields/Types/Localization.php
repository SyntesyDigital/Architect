<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class Localization extends Field implements FieldInterface
{
    public $type = 'localization';
    public $icon = 'fa-map-marker';
    public $name = 'LOCALIZATION';

    public $rules = [
        'required'
    ];

    public $settings = [
      'htmlId',
      'htmlClass'
    ];

    public function save($content, $identifier, $values, $languages = null)
    {
        if($content->fields()->save(new ContentField([
            'name' => $identifier,
            'value' => is_array($values) ? json_encode($values) : $values
        ]))) {
            return true;
        }

        return false;
    }

}
?>
