<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Fields\Field;

class Richtext extends Field implements FieldInterface
{
    public $type = 'richtext';
    public $icon = 'fa-align-left';
    public $name = 'RICHTEXT';

    public $rules = [
        'required',
        'maxCharacters',
    ];

    public $settings = [
        'fieldHeight',
        'htmlId',
        'htmlClass'
    ];
}
?>
