<?php

namespace Modules\Architect\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;

use Modules\Architect\Entities\Language;
use Datatables;
use Lang;

class LanguageRepository extends BaseRepository
{
    public function model()
    {
        return "Modules\\Architect\\Entities\\Language";
    }

    public function getDatatable($options = [])
    {
        return Datatables::of(Language::getAllCached())
            ->addColumn('default', function ($item) {
              return isset($item->default) && $item->default == 1 ? "<i class='fa fa-check-circle'></i>" : "<i class='fa fa-circle-thin'></i>";
            })
            ->addColumn('action', function ($item) {
                return '
                <a href="' . route('languages.show', $item) . '" class="btn btn-link" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> '.Lang::get("architect::datatables.edit").'</a>&nbsp;
                <a href="#" class="btn btn-link text-danger" data-toogle="delete" data-ajax="' . route('languages.delete', $item) . '" data-confirm-message="'.Lang::get("architect::language.del_lang_msg").'"><i class="fa fa-trash"></i>'.Lang::get("architect::datatables.delete").'</a> &nbsp;
                ';
            })
            ->rawColumns(['default', 'action'])
            ->make(true);
    }
}
