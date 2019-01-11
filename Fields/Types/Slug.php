<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;

class Slug extends Field implements FieldInterface
{
    public $type = 'slug';
    public $icon = 'fa-link';
    public $name = 'SLUG';

    public $rules = [
        'required',
        'unique'
    ];

    public $settings = [];
}
?>
