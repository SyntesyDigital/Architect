<?php

namespace Modules\Architect\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Auth;


use Modules\Architect\Repositories\TranslationRepository;

use Modules\Architect\Http\Requests\Translation\CreateTranslationRequest;
use Modules\Architect\Jobs\Translation\CreateTranslation;

use Modules\Architect\Http\Requests\Translation\UpdateTranslationRequest;
use Modules\Architect\Jobs\Translation\UpdateTranslation;

use Modules\Architect\Http\Requests\Translation\DeleteTranslationRequest;
use Modules\Architect\Jobs\Translation\DeleteTranslation;

// Models
use Modules\Architect\Entities\Translation;
use Lang;

class TranslationController extends Controller
{

    public function __construct(TranslationRepository $translations) {
        $this->translations = $translations;
    }

    public function index(Request $request)
    {
        return view('architect::translations.index', [
            "translations" => $this->translations->all()
        ]);
    }

    public function data(Request $request)
    {
        return $this->translations->getDatatable();
    }

    public function show(Translation $translation, Request $request)
    {
        return view('architect::translations.form', [
            'translation' => $translation,
        ]);
    }

    public function create(Request $request)
    {
        return view('architect::translations.form');
    }

    public function store(CreateTranslationRequest $request)
    {
        try {
            $translation = dispatch_now(CreateTranslation::fromRequest($request));

            if(!$translation) {
                throw new \Exception('Error occured while saving...');
            }

            return redirect(route('translations.show', $translation))->with('success', Lang::get("architect::fields.success"));
        } catch (\Exception $ex) {
            $error = $ex->getMessage();
        }

        return redirect(route('translations.create'))->with('error', $error);
    }

    public function update(Translation $translation, UpdateTranslationRequest $request)
    {
        try {
            $translation = dispatch_now(UpdateTranslation::fromRequest($translation, $request));

            if(!$translation) {
                throw new \Exception(Lang::get("architect::fields.error"));
            }

            return redirect(route('translations.show', $translation))->with('success', Lang::get("architect::fields.success"));
        } catch (\Exception $ex) {
            $error = $ex->getMessage();
        }

        return redirect(route('translations.show', $translation))->with('error', $error);
    }


    public function delete(Translation $translation, DeleteTranslationRequest $request)
    {
        return dispatch_now(DeleteTranslation::fromRequest($translation, $request)) ? response()->json([
            'success' => true
        ]) : response()->json([
            'success' => false
        ], 500);
    }


    public function updateOrder(Request $request)
    {

      if($request->exists('order')){
        $order = $request->get('order');

        foreach($order as $row){
          Translation::where('id', $row["id"])->update(['order' => $row["newOrder"]]);
          }

        return Response::json([
                'error' => false,
                'code'  => 200
            ], 200);
      }

      return Response::json([
                'error' => true,
                'code'  => 400
            ], 400);

    }

}
