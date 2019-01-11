<?php

namespace Modules\Architect\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;

use Modules\Architect\Entities\Translation;
use Datatables;
use Lang;

class TranslationRepository extends BaseRepository
{
    public function model()
    {
        return "Modules\\Architect\\Entities\\Translation";
    }

    public function getDatatable($options = [])
    {

        $results = Translation::leftJoin('translations_fields', 'translations.id', '=', 'translations_fields.translations_id')
            ->groupBy('translations.id')
            ->orderBy('translations.updated_at','DESC');

        return Datatables::of(Translation::all())
            ->addColumn('order', function ($item) {
                return isset($item->order) ? $item->order : null;
            })
            ->addColumn('name', function ($item) {
                return isset($item->name) ? $item->name : null;
            })
            ->addColumn('value', function ($item) {
                return $item->getDefaultValueAttribute();
            })
            ->addColumn('action', function ($item) {
                return '
                <a href="' . route('translations.show', $item) . '" class="btn btn-link" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> '.Lang::get("architect::datatables.edit").'</a>&nbsp;
                <a href="#" class="btn btn-link text-danger" data-toogle="delete" data-ajax="' . route('translations.delete', $item) . '" data-confirm-message="'.Lang::get("architect::datatables.continue").'"><i class="fa fa-trash"></i> '.Lang::get("architect::datatables.delete").'</a> &nbsp;
                ';
            })
            ->make(true);
    }
}
