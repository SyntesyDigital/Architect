<?php

namespace Modules\Architect\Http\Requests\Language;

use Illuminate\Foundation\Http\FormRequest;

class DeleteLanguageRequest extends FormRequest
{

    public function rules()
    {
        return [];
    }

    public function authorize()
    {
        return true;
    }
}
