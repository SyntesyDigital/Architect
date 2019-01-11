<?php

namespace Modules\Architect\Widgets\Types;

use Modules\Architect\Widgets\Widget;
use Modules\Architect\Widgets\WidgetInterface;

use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

class Separator extends Widget implements WidgetInterface
{
    public $type = 'widget';
    public $icon = 'fa-arrows-v';
    public $name = 'SEPARATOR';
    public $component = 'CommonWidget';

    public $fields = [];

    public $rules = [];

    public $hidden = true;

    public $settings = [
        'htmlId',
        'htmlClass',
        'height'
    ];

}
?>
