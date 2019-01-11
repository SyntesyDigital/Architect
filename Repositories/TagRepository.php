<?php

namespace Modules\Architect\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;

use Modules\Architect\Entities\Tag;
use Datatables;
use Lang;

class TagRepository extends BaseRepository
{
    public function model()
    {
        return "Modules\\Architect\\Entities\\Tag";
    }

    public function getDatatable()
    {
        $results = Tag::leftJoin('tags_fields', 'tags.id', '=', 'tags_fields.tag_id')
            ->select(
                'tags.*'
            )
            ->groupBy('tags.id');

        return Datatables::of($results)
            ->filterColumn('name', function ($query, $keyword) {
                $query->whereRaw("tags_fields.value LIKE ? AND tags_fields.name = 'name'", ["%{$keyword}%"]);
            })
            ->addColumn('name', function ($item) {
                return $item->name;
            })
            ->addColumn('action', function ($item) {
                return '
                <a href="' . route('tags.show', $item) . '" class="" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> '.Lang::get("architect::datatables.edit").'</a>
                <a href="#" class="text-danger" data-toogle="delete" data-ajax="' . route('tags.delete', $item) . '" data-confirm-message="'.Lang::get('architect::datatables.sure').'"><i class="fa fa-trash"></i> '.Lang::get("architect::datatables.delete").'</a> &nbsp;
                ';
            })
            ->make(true);
    }
}
