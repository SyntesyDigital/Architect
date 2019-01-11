<?php

namespace Modules\Architect\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;

use DataTables;
use Storage;
use Modules\Architect\Entities\Media;
use Lang;

use Modules\Architect\Repositories\Criterias\MediaModalDatatableCriteria;

class MediaRepository extends BaseRepository
{
    public function model()
    {
        return "Modules\\Architect\\Entities\\Media";
    }

    public function getDatatable()
    {
        $medias = Media::leftJoin('users', 'users.id', '=', 'medias.author_id')
            ->select(
                'medias.*',
                'users.firstname',
                'users.lastname'
            )
            ->type(request('type'))
            ->orderBy('created_at', 'desc');

        return Datatables::of($medias)
            ->filterColumn('author', function ($query, $keyword) {
                $query->whereRaw("CONCAT(users.firstname,' ',users.lastname) like ?", ["%{$keyword}%"]);
            })
            ->addColumn('author', function ($item) {
                return $item->author->full_name;
            })
            ->addColumn('preview', function ($item) {
                switch($item->type) {
                    case "image":
                        return '<img src="' . Storage::url('medias/' . config('images.display') .  '/' . $item->stored_filename) . '?t='.time().'" class="thumbnail select-media" data-id="'.$item->id.'" />';
                        break;

                    default:
                        return '<div class="pdf-preview select-media" data-id="'.$item->id.'"><i class="fa fa-file-pdf-o"></i><p class="title">'.$item->uploaded_filename.'</p></div>';
                        break;
                }

            })
            ->addColumn('action', function ($item) {

                $html = "";

                //$html .= '<a href="'..'" target="_blank" class="btn btn-sm" data-id="'.$item->id.'"><i class="fa fa-pencil"> &nbsp; Editar</a>';

                if($item->type == "image") {
                    $html .= '<a href="#" class="btn btn-link toogle-edit" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> '.Lang::get("architect::datatables.edit").'</a> &nbsp;';
                }

                $html .= '<a href="#" class="btn btn-link text-danger toogle-delete" data-toogle="delete" data-ajax="'.route('medias.delete', $item).'" data-confirm-message="'.Lang::get('architect::datatables.sure').'"><i class="fa fa-trash"></i> '.Lang::get("architect::datatables.delete").'</a> &nbsp;';

                return $html;
            })
            ->rawColumns(['preview', 'action'])
        ->make(true);
    }
}
