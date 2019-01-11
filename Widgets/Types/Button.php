<?php

namespace Modules\Architect\Widgets\Types;

use Modules\Architect\Widgets\Widget;
use Modules\Architect\Widgets\WidgetInterface;

use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

class Button extends Widget implements WidgetInterface
{
    public $type = 'widget';
    public $icon = 'fa-external-link-square';
    public $name = 'BUTTON';
    public $component = 'CommonWidget';

    public $fields = [
        'link' => 'Modules\Architect\Fields\Types\Link',
    ];

    public $rules = [
        'required'
    ];

    //public $hidden = true;

    public $settings = [
        'htmlId',
        'htmlClass'
    ];

}
?>
