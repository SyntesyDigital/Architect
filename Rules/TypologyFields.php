<?php

namespace Modules\Architect\Rules;

use Illuminate\Contracts\Validation\Rule;

use Modules\Architect\Fields\FieldValidator;

class TypologyFields implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->errors = [];
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $values)
    {
        foreach($values as $k => $v) {
            $field = (object) $v;
            if(!$field->name || !$field->identifier) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('architect::rules.emptyTypologyFields');
    }
}
