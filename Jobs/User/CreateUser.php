<?php

namespace Modules\Architect\Jobs\User;

use Modules\Architect\Http\Requests\User\CreateUserRequest;

use App\Models\User;
use Hash;

class CreateUser
{
    public function __construct($attributes = [])
    {
        $this->attributes = array_only($attributes, [
            'firstname',
            'lastname',
            'email',
            'password',
            'role_id',
            'language',
        ]);
    }

    public static function fromRequest(CreateUserRequest $request)
    {
        return new self($request->all());
    }

    public function handle()
    {
        $this->attributes['password'] = trim(Hash::make($this->attributes['password']));

        $user = User::create($this->attributes);

        if(isset($this->attributes['role_id'])) {
            $user->roles()->sync($this->attributes['role_id']);
        }

        return $user;
    }
}
