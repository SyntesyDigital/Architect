<?php

namespace Modules\Architect\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'email' => 'email|required',
            'firstname' => 'required',
            'lastname' => 'required',
            'password' => request('password') ? 'required|confirmed' : '',
            'role_id' => 'required',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
