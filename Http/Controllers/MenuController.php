<?php

namespace Modules\Architect\Http\Controllers;

use App\Http\Controllers\Controller;

use Modules\Architect\Repositories\MenuRepository;

use App\Models\User;
use Auth;
use Session;

use Modules\Architect\Entities\Menu;

use Modules\Architect\Http\Requests\Menu\CreateMenuRequest;
use Modules\Architect\Jobs\Menu\CreateMenu;

use Modules\Architect\Http\Requests\Menu\UpdateMenuRequest;
use Modules\Architect\Jobs\Menu\UpdateMenu;

use Modules\Architect\Http\Requests\Menu\DeleteMenuRequest;
use Modules\Architect\Jobs\Menu\DeleteMenu;

class MenuController extends Controller
{
    public function __construct(MenuRepository $menus)
    {
        $this->menus = $menus;
        $this->middleware('auth');
    }

    public function index()
    {
        return view('architect::menu.index');
    }

    public function data()
    {
        return $this->menus->getDatatable();
    }

    public function element($id)
    {
        return $this->menus->getElement($id);
    }

    public function elementsTree(Menu $menu)
    {
        return $this->menus->getElementTree($menu);
    }

    public function show($id)
    {
        return view('architect::menu.form', [
            'menu' => $this->menus->find($id)
        ]);
    }

    public function create()
    {
        return view('architect::menu.form');
    }

    public function store(CreateMenuRequest $request)
    {
        $menu = dispatch_now(CreateMenu::fromRequest($request));

        return $menu ? response()->json([
            'success' => true,
            'menu' => $menu
        ]) : response()->json([
            'success' => false
        ], 500);
    }

    public function update(Menu $menu, CreateMenuRequest $request)
    {

        $menu = dispatch_now(UpdateMenu::fromRequest($menu, $request));

        return $menu ? response()->json([
            'success' => true,
            'menu' => $menu
        ]) : response()->json([
            'success' => false
        ], 500);
    }

    public function delete(Menu $menu, DeleteMenuRequest $request)
    {
        return dispatch_now(DeleteMenu::fromRequest($menu, $request)) ? response()->json([
            'success' => true
        ]) : response()->json([
            'success' => false
        ], 500);
    }

}
