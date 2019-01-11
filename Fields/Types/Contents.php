<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class Contents extends Field implements FieldInterface
{
    public $type = 'contents';
    public $icon = 'fa-file-o';
    public $name = 'CONTENTS';

    public $rules = [
        'required',
        'maxItems',
        'minItems'
    ];

    public $settings = [
        'typologyAllowed',
        'htmlId',
        'htmlClass'
    ];

    public function save($content, $identifier, $values, $languages = null)
    {
        if(!$values) {
            return false;
        }

        foreach($values as $value) {
            $id = isset($value['id']) ? $value['id'] : null;

            if($id) {
                $content->fields()->save(new ContentField([
                    'name' => $identifier,
                    'value' => $id,
                    'relation' => 'contents'
                ]));
            }
        }

        return true;
    }
}
?>
