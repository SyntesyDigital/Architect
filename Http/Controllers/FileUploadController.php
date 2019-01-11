<?php

namespace Modules\Architect\Http\Controllers;

use Modules\Architect\Repositories\ImageUploadRepository;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Lang;

class FileUploadController extends Controller
{
    public function __construct(ImageUploadRepository $images)
    {
        $this->images = $images;
    }

    public function postUpload(Request $request)
    {
        $resizeWidth = $request->exists('resizeWidth')
            ? $request->get('resizeWidth')
            : null;

        $result = $this->images->upload($request->all(), $resizeWidth);

        return $result['error']
            ? response()->json($result, 500)
            : response()->json($result, 200);
    }


    public function deleteUpload(Request $request)
    {
        $httpCode = $this->images->delete($filename) ? 200 : 500;

        return response()->json([
            'error' => $httpCode == 500 ? true : false,
            'message' => $httpCode == 500 ? Lang::get("architect::fields.error") : null,
            'code' => $httpCode,
        ], $httpCode);
    }
}
