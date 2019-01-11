<?php

namespace Modules\Architect\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Auth;
use Modules\Architect\Http\Requests\SaveContent;

class ArchitectController extends Controller
{
    public function index()
    {

        return view('architect::index');
    }

    public function settings()
    {
        return view('architect::settings');
    }
}
