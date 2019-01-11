<?php

namespace Modules\Architect\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Modules\Architect\Entities\Typology;

class SaveContent extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $typology = Typology::find($this->get('typology_id'));

        $rules = $typology->fields->mapWithKeys(function ($field) {
            return [$field->identifier => $field->rules];
        });

        return $rules->all();
    }

    //
    // See : https://stackoverflow.com/questions/46670018/how-to-set-custom-response-for-selected-request-class-in-laravel-5-5?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    //
    // protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    // {
    //     $response = new JsonResponse([
    //         'success' => false,
    //         'errors' => $validator->errors()
    //     ], 422);
    //
    //     throw new \Illuminate\Validation\ValidationException($validator, $response);
    // }


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
