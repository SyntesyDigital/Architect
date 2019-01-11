<?php

namespace Modules\Architect\Http\Requests\Translation;

use Illuminate\Foundation\Http\FormRequest;

class CreateTranslationRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required',
            'fields.value.*' => 'required'
        ];
    }

    public function authorize()
    {
        return true;
    }
}
