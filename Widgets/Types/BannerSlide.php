<?php

namespace Modules\Architect\Widgets\Types;

use Modules\Architect\Widgets\Widget;
use Modules\Architect\Widgets\WidgetInterface;

use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

class BannerSlide extends Widget implements WidgetInterface
{
    public $type = 'widget';
    public $icon = 'fa-picture-o';
    public $name = 'BANNER_SLIDE';
    public $component = 'CommonWidget';

    public $fields = [
        'image' => 'Modules\Architect\Fields\Types\Image',
        'title' => 'Modules\Architect\Fields\Types\Text',
        'subtitle' => 'Modules\Architect\Fields\Types\Text',
        'url' => 'Modules\Architect\Fields\Types\Url'
    ];

    public $rules = [
        'required'
    ];

    public $hidden = true;

    public $settings = [
        'htmlId',
        'htmlClass',
        'cropsAllowed',
    ];

}
?>
