<?php

namespace Modules\Architect\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Auth;
use Modules\Architect\Repositories\MediaRepository;

use Modules\Architect\Http\Requests\Media\CreateMediaRequest;
use Modules\Architect\Http\Requests\Media\DeleteMediaRequest;
use Modules\Architect\Http\Requests\Media\UpdateMediaRequest;

use Modules\Architect\Jobs\Media\DeleteMedia;
use Modules\Architect\Jobs\Media\CreateMedia;
use Modules\Architect\Jobs\Media\UpdateMedia;

use Illuminate\Support\Facades\Bus;

use Modules\Architect\Entities\Media;
use Lang;

use Session;

class MediaController extends Controller
{

    public function __construct(MediaRepository $medias) {
        $this->medias = $medias;
    }

    public function index()
    {
        return view('architect::medias.index');
    }

    public function data()
    {
        return $this->medias->getDatatable();
    }

    public function store(CreateMediaRequest $request)
    {
        $media = dispatch_now(CreateMedia::fromRequest($request));

        return $media ? response()->json([
            'success' => true,
            'response' => $media
        ]) : response()->json([
            'success' => false
        ], 500);
    }

    public function show($id, Request $request)
    {
        $media = $this->medias->with('author')->find($id);

        return response()->json([
            'success' => $media ? true : false,
            'media' => $media
        ]);
    }

    public function update(Media $media, UpdateMediaRequest $request)
    {
        if(dispatch_now(UpdateMedia::fromRequest($media, $request))) {
            return response()->json([
                'success' => true,
                'message' => Lang::get("architect::fields.success")
            ]);
        }

        return response()->json([
            'success' => false
        ], 500);
    }

    public function delete($id, Request $request)
    {
        if (dispatch_now(new DeleteMedia($this->medias->find($id)))) {
            return $request->ajax()
                ? response()->json([
                    'success' => true,
                    'message' => Lang::get("architect::fields.success")
                ]) : redirect()->route('admin.content.medias.index');
        }

        return $request->ajax()
            ? response()->json([
                'error' => true,
                'message' => Lang::get("architect::fields.error")
            ], 500)
            : redirect()->route('admin.content.medias.index');
    }

}
