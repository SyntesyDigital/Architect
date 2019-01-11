<?php
namespace Modules\Architect\Fields;

use Modules\Architect\Entities\Content;

interface FieldInterface
{
    public function save($content, $identifier, $values, $languages = null);

    public function getRules();
}

?>
