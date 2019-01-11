<?php

namespace Modules\Architect\Repositories;

use App\Models\Role;
use App\Models\User;
use Prettus\Repository\Eloquent\BaseRepository;
use DB;
use Datatables;
use Lang;

class UserRepository extends BaseRepository
{
    public function model()
    {
        return 'App\\Models\\User';
    }

    public function getDatatable()
    {
        $users = User::select([
            'users.*',
            DB::raw("CONCAT(users.firstname,' ',users.lastname) as full_name"),
        ])->whereHas('roles', function ($q) {
            $q->whereIn('name', config('architect::settings.users.only_display'));
        });

        return Datatables::of($users)
            ->addColumn('name', function ($item) {
                return $item->full_name;
            })
            ->addColumn('action', function ($item) {
                return '
                <a href="' . route('users.show', $item) . '" class="btn btn-link" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> '.Lang::get("architect::datatables.edit").'</a> &nbsp;
                <a href="#" class="btn btn-link text-danger" data-toogle="delete" data-ajax="' . route('users.delete', $item) . '" data-confirm-message="'.Lang::get('architect::datatables.sure').'"><i class="fa fa-trash"></i> '.Lang::get("architect::datatables.delete").'</a> &nbsp;
                ';
            })
            ->make(true);
    }

    public function getAllByRoles($roles)
    {
        $roles = ! is_array($roles) ? $roles = [$roles] : $roles;

        return User::whereHas('roles', function ($q) use ($roles) {
            $q->whereIn('name', $roles);
        })->get();
    }
}
