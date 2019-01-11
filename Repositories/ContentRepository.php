<?php

namespace Modules\Architect\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;

use DataTables;
use Storage;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Field;

use App;
use Auth;
use Lang;

use Modules\Architect\Repositories\Criterias\ContentModalDatatableCriteria;

class ContentRepository extends BaseRepository
{
    protected $fieldSearchable = [
    	'typology_id',
        'author_id',
        'parent_id',
        'is_page',
        'published_at',
        'typology.identifier',
        'typology.has_categories',
        'typology.has_tags',
        'typology.has_slug'
    ];

    public function boot()
    {
        $this->pushCriteria(app('Prettus\Repository\Criteria\RequestCriteria'));
    }

    public function model()
    {
        return "Modules\\Architect\\Entities\\Content";
    }

    public function getDatatable($options = [])
    {
        $results = Content::leftJoin('contents_fields', 'contents.id', '=', 'contents_fields.content_id')
            ->leftJoin('users', 'contents.author_id', '=', 'users.id')
            ->select(
                'contents.*',
                'users.firstname',
                'users.lastname'
            )
            ->groupBy('contents.id')
            ->orderBy('contents.updated_at','DESC')
            ->with(
                'author',
                'typology',
                'urls',
                'page',
                'fields',
                'parent'
            );

        if(isset($options["where"])) {
            foreach($options["where"] as $where) {
                if(sizeof($where) > 2) {
                    $results->where($where[0], $where[1], $where[2]);
                } else {
                    $results->where($where[0], $where[1]);
                }
            }
        }

        if(isset($options["whereHas"])) {
            foreach($options["whereHas"] as $relation => $where) {
                $results->whereHas($relation, function ($query) use($relation, $where) {
                    if(sizeof($where) > 2) {
                        $query->where($where[0], $where[1], $where[2]);
                    } else {
                        $query->where($where[0], $where[1]);
                    }
                });
            }
        }

        // Array of all entryTitle
        $fields = Field::where('settings', 'LIKE', '%"entryTitle":true%')->get();
        $titleFields = ['title'];

        if($fields) {
            foreach($fields as $k => $v) {
                if(!in_array($v->identifier, $titleFields)) {
                    $titleFields[] = $v->identifier ;
                }
            }
        }

        return Datatables::of($results)

            ->addColumn('author', function ($item) {
                return isset($item->author) ? $item->author->full_name : null;
            })
            ->filterColumn('author', function ($query, $author_id) {
                $query->whereRaw("contents.author_id = ?", $author_id);
            })

            ->addColumn('title', function ($item) {
                $title = isset($item->title) ? $item->title : '';

                if($item->is_page){
                  if(isset($item->parent)){
                    $parent = $item->parent()->first();
                    $title = ( $parent->title ? $parent->title.' / ' : '' ) . $title;
                  }
                }
                return '<a class="title" href="' . route('contents.show', $item) . '" >'.$title.'</a>';
            })
            ->filterColumn('title', function ($query, $keyword) use ($titleFields) {
                $query->whereRaw("
                    contents_fields.value LIKE '%{$keyword}%'
                    AND contents_fields.name IN ('".implode(",", $titleFields)."')
                ");
            })

            ->addColumn('updated', function ($item) {
                return $item->updated_at->format('d, M, Y');
            })
            ->addColumn('status', function ($item) {
                return $item->getStringStatus();
            })
            ->addColumn('typology', function ($item) {
                if($item->page) {
                    return 'Page';
                }
                return isset($item->typology) ? ucfirst(strtolower($item->typology->name)) : null;
            })
            ->addColumn('action', function ($item) {

                $buttons = '';

                if($item->page) {
                  $buttons .= '<a title="Previsualitzar" href="/es/preview/'.$item->id.'" class="btn btn-link" target="_blank"><i class="fa fa-eye"></i> </a> &nbsp;';
                }

                $buttons .= '<a title="'.Lang::get("architect::datatables.edit").'" href="' . route('contents.show', $item) . '" class="btn btn-link" data-toogle="edit" data-id="'.$item->id.'"><i class="fa fa-pencil"></i> </a> &nbsp';

                //si no es ( pagina y author a la vez add remove)
                if(!($item->page && Auth::user()->hasRole(["author"]))){
                  $buttons .= '<a title="'.Lang::get("architect::datatables.delete").'" href="#" class="btn btn-link text-danger" data-toogle="delete" data-ajax="' . route('contents.delete', $item) . '" data-confirm-message="'.Lang::get('architect::datatables.sure').'"><i class="fa fa-trash"></i> </a> &nbsp';
                }

                return $buttons;
            })
            ->rawColumns(['title', 'action'])
            ->make(true);
    }

    public function getModalDatatable()
    {
        return Datatables::of($this->getByCriteria(new ContentModalDatatableCriteria()))

            ->addColumn('title', function ($item) {
                $title = isset($item->title) ? $item->title : '';

                if($item->is_page){
                  if(isset($item->parent)){
                    $parent = $item->parent->title;
                    $title = ( $parent ? $parent.' / ' : '' ) . $title;
                  }
                }

                return $title;
            })

            ->addColumn('updated', function ($item) {
                return $item->updated_at->format('d, M, Y');
            })
            ->addColumn('status', function ($item) {
                return $item->getStringStatus();
            })
            ->addColumn('typology', function ($item) {
                if($item->page) {
                    return 'Page';
                }
                return isset($item->typology) ? ucfirst(strtolower($item->typology->name)) : null;
            })
            ->addColumn('author', function ($item) {
                return isset($item->author) ? $item->author->full_name : null;
            })
            ->addColumn('action', function ($item) {
                return '
                    <a href="" id="item-'.$item->id.'" data-content="'.base64_encode($item->toJson()).'" class="btn btn-link add-item" data-type="'.( isset($item->typology) ? $item->typology->name : null ).'" data-name="'.$item->getField('title').'" data-id="'.$item->id.'"><i class="fa fa-plus"></i> '.Lang::get("architect::fields.add").'</a> &nbsp;
                ';
            })
            ->make(true);
    }

    public function getTreeWithHyphens()
    {
      $index = 0;
      $pageTree = array();
      $level = 1;

      $traverse = function (&$pageTree,$pages, &$index,$level) use (&$traverse) {
          $level++;
          $prev_string = '';
          if($level >= 1){
            for($i=1;$i<$level;$i++){

              $prev_string .= "-";

            }
            $prev_string .= " ";
          }

          foreach ($pages as $page) {

            $pageTree[$index]['id']= $page->id;
            $pageTree[$index]['title']= $prev_string.$page->getTitleAttribute();
            $index ++;
            $traverse($pageTree,$page->children, $index,$level);
          }
      };

      $pages = Content::where('is_page', 1)->get();


      foreach($pages as $page) {

        if(!$page->parent_id) {

          $pageTree[$index]['id']= $page->id;
          $pageTree[$index]['title']= $page->getTitleAttribute();
          $index++;
          //all parents

          $traverse($pageTree,Content::getTree($page->id), $index,$level);
        }
      }
      return  $pageTree;

    }

    public function getPagesGraph()
    {
      $nodes = array();
      $links = array();
      $level = 1;

      $traverse = function (&$pageTree,$pages, &$nodes,&$links,$level) use (&$traverse) {
          $level++;

          foreach ($pages as $page) {

            $nodes[] = [
              "id" => $page->id,
              "title" => $page->getTitleAttribute(),
              "level" => $level,
              "status" => $page->status,
              "author" => $page->author->getFullNameAttribute(),
              "url" => $page->url
            ];

            $links[] = [
              "source" => $page->parent_id,
              "target" => $page->id
            ];

            $traverse($pageTree,$page->children, $nodes,$links,$level);
          }
      };

      $pages = Content::where('is_page', 1)->get();
      $homeId = null;

      foreach($pages as $page) {
        if(strtolower($page->title) == 'home'){

          $homeId = $page->id;

          $nodes[] = [
            "id" => $page->id,
            "title" => $page->title,
            "level" => $level,
            "status" => $page->status,
            "author" => $page->author->getFullNameAttribute(),
            "url" => $page->url
          ];

          $level++;
          break;
        }
      }

      foreach($pages as $page) {

        if(!$page->parent_id && $page->id != $homeId) {

          $nodes[] = [
            "id" => $page->id,
            "title" => $page->getTitleAttribute(),
            "level" => $level,
            "status" => $page->status,
            "author" => $page->author->getFullNameAttribute(),
            "url" => $page->url
          ];

          if($homeId != null){
            $links[] = [
              "source" => $homeId,
              "target" => $page->id
            ];
          }

          $traverse($pageTree,Content::getTree($page->id), $nodes,$links,$level);
        }
      }

      return  [
        "nodes" => $nodes,
        "links" => $links
      ];

    }

}
