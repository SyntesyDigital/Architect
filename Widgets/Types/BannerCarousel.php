<?php

namespace Modules\Architect\Widgets\Types;

use Modules\Architect\Widgets\Widget;
use Modules\Architect\Widgets\WidgetInterface;

use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

class BannerCarousel extends Widget implements WidgetInterface
{
    public $type = 'widget-list';
    public $icon = 'fa-th-list';
    public $name = 'BANNER_CAROUSEL';
    public $widget = 'BANNER_SLIDE';

    public $rules = [
        'required'
    ];

    public $settings = [
        'htmlId',
        'htmlClass',
        'cropsAllowed',
    ];
}
?>
