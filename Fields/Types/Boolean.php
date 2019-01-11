<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;

class Boolean extends Field implements FieldInterface
{
    public $type = 'boolean';
    public $icon = 'fa-check-square-o';
    public $name = 'BOOLEAN';

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
        return parent::save($content, $identifier, $values, $languages);
    }

}
?>
