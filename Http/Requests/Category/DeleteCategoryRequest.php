<?php

namespace Modules\Architect\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class DeleteCategoryRequest extends FormRequest
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
