<?php
namespace Modules\Architect\Widgets;

use Modules\Architect\Entities\Content;

interface WidgetInterface
{
    public function save($content, $identifier, $values);

    //public function getRules();
}

?>
