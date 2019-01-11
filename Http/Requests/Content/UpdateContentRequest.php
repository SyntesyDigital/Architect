<?php

namespace Modules\Architect\Http\Requests\Content;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if(request('is_page')) {
            return [
                'status' => 'required',
                'author_id' => 'required',
            ];
        }

        return [
            'status' => 'required',
            'typology_id' => 'required',
            'author_id' => 'required',
            'fields' => ['required', new ContentField]
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
}
