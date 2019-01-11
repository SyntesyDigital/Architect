<?php

namespace Modules\Architect\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Auth;
use Modules\Architect\Repositories\TagRepository;

use Modules\Architect\Http\Requests\Tag\CreateTagRequest;
use Modules\Architect\Jobs\Tag\CreateTag;

use Modules\Architect\Http\Requests\Tag\UpdateTagRequest;
use Modules\Architect\Jobs\Tag\UpdateTag;

use Modules\Architect\Http\Requests\Tag\DeleteTagRequest;
use Modules\Architect\Jobs\Tag\DeleteTag;

// Models
use Modules\Architect\Entities\Tag;
use Modules\Architect\Entities\Typology;
use App\Models\User;
use App\Models\Role;
use Lang;

class TagController extends Controller
{

    public function __construct(TagRepository $tags) {
        $this->tags = $tags;
    }

    public function index(Request $request)
    {
        return view('architect::tags.index', [
            "typologies" => Typology::all(),
            "tags" => $this->tags->all()
        ]);
    }

    public function data(Request $request)
    {
        return $this->tags->getDatatable();
    }

    public function show(Tag $tag, Request $request)
    {
        return view('architect::tags.form', [
            'tag' => $tag,
        ]);
    }

    public function create(Request $request)
    {
        return view('architect::tags.form');
    }

    public function store(CreateTagRequest $request)
    {
        try {
            $tag = dispatch_now(CreateTag::fromRequest($request));

            if(!$tag) {
                throw new \Exception(Lang::get("architect::fields.error"));
            }

            return redirect(route('tags.show', $tag))->with('success',Lang::get("architect::fields.success"));
        } catch (\Exception $ex) {
            $error = $ex->getMessage();
        }

        return redirect(route('tags.create'))->with('error', $error);
    }

    public function update(Tag $tag, UpdateTagRequest $request)
    {
        try {
            $tag = dispatch_now(UpdateTag::fromRequest($tag, $request));

            if(!$tag) {
                throw new \Exception(Lang::get("architect::fields.error"));
            }

            return redirect(route('tags.show', $tag))->with('success', Lang::get("architect::fields.success"));
        } catch (\Exception $ex) {
            $error = $ex->getMessage();
        }

        return redirect(route('tags.show', $tag))->with('error', $error);
    }


    public function delete(Tag $tag, DeleteTagRequest $request)
    {
        return dispatch_now(DeleteTag::fromRequest($tag, $request)) ? response()->json([
            'success' => true
        ]) : response()->json([
            'success' => false
        ], 500);
    }

}
