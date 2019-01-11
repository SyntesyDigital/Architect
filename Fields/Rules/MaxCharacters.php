<?php

namespace Modules\Architect\Fields\Rules;

class MaxCharacters
{
    public $name = "maxCharacters";

    public function validate($value, $param, $identifier)
    {
        $values = !is_array($value) ? [$value] : $value;
        $errors = [];
        
        if($param) {
            foreach($values as $k => $value) {
                if(strlen($value) > $param) {
                    $errors[$k] = $this->message();
                }
            }
        }

        return !empty($errors) ? $errors : null;
    }

    public function message()
    {
        return trans('architect::rules.maxCharacters');
    }
}
