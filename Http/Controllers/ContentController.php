<?php

namespace Modules\Architect\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Auth;
use Modules\Architect\Repositories\ContentRepository;
use Modules\Architect\Repositories\CategoryRepository;
use Modules\Architect\Repositories\UserRepository;

// Jobs & Requests
use Modules\Architect\Http\Requests\Content\CreateContentRequest;
use Modules\Architect\Jobs\Content\CreateContent;

use Modules\Architect\Http\Requests\Content\UpdateContentRequest;
use Modules\Architect\Jobs\Content\UpdateContent;

use Modules\Architect\Http\Requests\Content\DeleteContentRequest;
use Modules\Architect\Jobs\Content\DeleteContent;

use Modules\Architect\Http\Requests\Content\PublishContentRequest;
use Modules\Architect\Jobs\Content\PublishContent;

use Modules\Architect\Http\Requests\Content\DuplicateContentRequest;
use Modules\Architect\Jobs\Content\DuplicateContent;

// Models
use Modules\Architect\Entities\Typology;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Tag;
use Modules\Architect\Entities\Category;
use App\Models\User;
use App\Models\Role;

use Modules\Architect\Fields\FieldsReactAdapter;
use Modules\Architect\Fields\FieldsReactPageBuilderAdapter;

class ContentController extends Controller
{

    public function __construct(ContentRepository $contents, CategoryRepository $categories, UserRepository $users) {
        $this->contents = $contents;
        $this->categories = $categories;
        $this->users = $users;
    }

    public function index(Request $request)
    {
        return view('architect::contents.index', [
            "typologies" => Typology::all(),
            "users" => $this->users->getAllByRoles(['admin', 'editor', 'author'])->mapWithKeys(function($user){
                return [$user->id => $user->full_name];
            })
        ]);
    }

    public function data(Request $request)
    {
        $options = [];

        if($request->get('typology_id')) {
            $options['where'] = [
                ['typology_id', '=', $request->get('typology_id')]
            ];
        }

        if($request->get('display_pages')) {
            $options["whereHas"] = [
                'page' => ['content_id','<>', null]
            ];
        }

        return $this->contents->getDatatable($options);
    }

    public function pagesTree(Request $request)
    {
      return $this->contents->getPagesGraph();
    }

    public function modalData(Request $request)
    {
        return $this->contents->getModalDatatable();
    }

    public function show(Content $content, Request $request)
    {
        if($content->typology) {
            $content->typology->load('fields');
        }

        $data = [
            'content' => $content->load('tags', 'categories', 'languages'),
            'typology' => $content->typology,
            'fields' => $content->typology ? (new FieldsReactAdapter($content))->get() : null,
            'page' => $content->is_page ? (new FieldsReactPageBuilderAdapter($content))->get() : null,
            'settings' => $content->settings,
            'pages' => $this->contents->getTreeWithHyphens(),
            'users' => User::all(),
            'tags' => Tag::all(),
            'categories' => $this->categories->getTree()
        ];

        //print_r($data["page"]);
        //exit();

        return view('architect::contents.show', $data);
    }

    public function create(Typology $typology=null, Request $request)
    {
        return view('architect::contents.show', [
            'typology' => $typology != null ? $typology->load('fields') : null,
            'fields' => $typology != null ? (new FieldsReactAdapter($typology))->get() : null,
            'page' => null,
            'settings' => null,
            'pages' => $this->contents->getTreeWithHyphens(),
            'users' => User::all(),
            'tags' => Tag::all(),
            'categories' => $this->categories->getTree()
        ]);
    }

    public function store(CreateContentRequest $request)
    {
        $content = dispatch_now(CreateContent::fromRequest($request));

        return $content ? response()->json([
            'success' => true,
            'content' => $content
        ]) : response()->json([
            'success' => false
        ], 500);
    }

    public function publish(Content $content, PublishContentRequest $request)
    {
        if(dispatch_now(PublishContent::fromRequest($content, $request))) {
            return response()->json([
                'success' => true
            ]);
        }

        return response()->json([
            'success' => false
        ], 500);
    }

    public function update(Content $content, CreateContentRequest $request)
    {
        $content = dispatch_now(UpdateContent::fromRequest($content, $request));

        return $content ? response()->json([
            'success' => true,
            'content' => $content
        ]) : response()->json([
            'success' => false
        ], 500);
    }

    public function delete(Content $content, DeleteContentRequest $request)
    {
        return dispatch_now(DeleteContent::fromRequest($content, $request)) ? response()->json([
            'success' => true
        ]) : response()->json([
            'success' => false
        ], 500);
    }


    public function duplicate(Content $content, DuplicateContentRequest $request)
    {
        $content = dispatch_now(DuplicateContent::fromRequest($content, $request));

        return $content ? response()->json([
            'success' => true,
            'content' => $content
        ]) : response()->json([
            'success' => false
        ], 500);
    }
}
