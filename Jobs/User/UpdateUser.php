<?php

namespace Modules\Architect\Jobs\User;

use Modules\Architect\Http\Requests\User\UpdateUserRequest;

use App\Models\User;
use Hash;

class UpdateUser
{
    public function __construct(User $user, $attributes)
    {
        $this->user = $user;

        $this->attributes = array_only($attributes, [
            'firstname',
            'lastname',
            'email',
            'password',
            'role_id',
            'language',
        ]);
    }

    public static function fromRequest(User $user, UpdateUserRequest $request)
    {
        return new self($user, $request->all());
    }

    public function handle()
    {

        if(trim($this->attributes['password']) !== '') {
            $this->attributes['password'] = Hash::make(trim($this->attributes['password']));
        } else {
            array_forget($this->attributes, 'password');
        }

        $this->user->roles()->sync($this->attributes['role_id']);

        return $this->user->update($this->attributes);
        
    }
}
