<?php

namespace Modules\Architect\Fields\Rules;

class MinItems
{
    public $name = "minItems";

    public function validate($value, $param, $identifier)
    {
    
    }

    public function message()
    {
        return 'Empty field !';
    }
}
