<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class Images extends Field implements FieldInterface
{
    public $type = 'images';
    public $icon = 'fa-picture-o';
    public $name = 'IMAGES';

    public $rules = [
        'required',
        'maxItems',
        'minItems'
    ];

    public $settings = [
        'cropsAllowed',
        'htmlId',
        'htmlClass'
    ];

    public function save($content, $identifier, $values, $languages = null)
    {
        foreach($values as $value) {
            $id = isset($value['id']) ? $value['id'] : null;

            if($id) {
                $content->fields()->save(new ContentField([
                    'name' => $identifier,
                    'value' => $id,
                    'relation' => 'medias'
                ]));
            }
        }

        return true;
    }
}
?>
