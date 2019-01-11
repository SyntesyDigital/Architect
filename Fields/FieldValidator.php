<?php

namespace Modules\Architect\Fields;

use Modules\Architect\Fields\FieldRules;

class FieldValidator
{

    public function __construct()
    {
        $this->rules = (new FieldRules())->get();
    }

    public function validate($values)
    {
        $errors = [];

        foreach($values as $field) {

            $values = isset($field["value"]) ? $field["value"] : null;
            $rules = isset($field["rules"]) ? $field["rules"] : null;
            $identifier = isset($field["identifier"]) ? $field["identifier"] : null;

            if(is_array($rules)) {
                foreach($rules as $rule => $param) {
                    $error = $this->validateField($rule, $values, $param, $identifier);

                    if($error) {
                        $errors[$identifier] = $error;
                    }
                }
            }

        }

        return $errors;
    }


    public function validateField($rule, $values, $param, $identifier)
    {
        return isset($this->rules[$rule]) ? $this->rules[$rule]->validate($values, $param, $identifier) : null;
    }

}
?>
