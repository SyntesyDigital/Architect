<?php

namespace Modules\Architect\Rules;

use Illuminate\Contracts\Validation\Rule;

use Modules\Architect\Fields\FieldValidator;

class ContentField implements Rule
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
        $validator = new FieldValidator();
        $this->errors = $validator->validate($values);

        return empty($this->errors) ? true : false;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->errors;
    }
}
