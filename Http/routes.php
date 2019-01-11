<?php


Auth::routes();

Route::group([
  'middleware' => ['web', 'auth','role:recruiter|admin', 'DetectUserLocale'],
  'prefix' => 'architect',
  'namespace' => 'Modules\Architect\Http\Controllers'
], function()
{

    Route::get('/', 'ArchitectController@index')->name('dashboard');

    // Account
    Route::post('/account/save', 'AccountController@save')->name('account.save');
    Route::get('/account', 'AccountController@index')->name('account');

    // Users
    Route::get('/users', 'UserController@index')->name('users');
    Route::get('/users/data', 'UserController@data')->name('users.data');
    Route::post('/users', 'UserController@store')->name('users.store');
    Route::get('/users/create', 'UserController@create')->name('users.create');
    Route::put('/users/{user?}/update', 'UserController@update')->name('users.update');
    Route::delete('/users/{user?}/delete', 'UserController@delete')->name('users.delete');
    Route::get('/users/{user?}', 'UserController@show')->name('users.show');

    /*
    |--------------------------------------------------------------------------
    | FILE UPLOAD
    |--------------------------------------------------------------------------
    */
    Route::post('/file/upload', ['as' => 'upload-post', 'uses' => 'FileUploadController@postUpload']);
});


/*
|--------------------------------------------------------------------------
| CUSTOMER
|--------------------------------------------------------------------------
*/
Route::group([
  'middleware' => ['web', 'auth','role:recruiter|admin|customer', 'DetectUserLocale'],
  'prefix' => 'architect',
  'namespace' => 'Modules\Architect\Http\Controllers'
], function()
{

    Route::get('/', 'ArchitectController@index')->name('dashboard');

    // Account
    Route::post('/account/save', 'AccountController@save')->name('account.save');
    Route::get('/account', 'AccountController@index')->name('account');

    // Users
    Route::get('/users', 'UserController@index')->name('users');
    Route::get('/users/data', 'UserController@data')->name('users.data');
    Route::post('/users', 'UserController@store')->name('users.store');
    Route::get('/users/create', 'UserController@create')->name('users.create');
    Route::put('/users/{user?}/update', 'UserController@update')->name('users.update');
    Route::delete('/users/{user?}/delete', 'UserController@delete')->name('users.delete');
    Route::get('/users/{user?}', 'UserController@show')->name('users.show');

    /*
    |--------------------------------------------------------------------------
    | FILE UPLOAD
    |--------------------------------------------------------------------------
    */
    Route::post('/file/upload', ['as' => 'upload-post', 'uses' => 'FileUploadController@postUpload']);
});


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::group([
  'middleware' => ['web', 'auth','role:admin', 'DetectUserLocale'],
  'prefix' => 'architect',
  'namespace' => 'Modules\Architect\Http\Controllers'
], function()
{

  // Categories
  Route::get('/categories', 'CategoryController@index')->name('categories');
  Route::get('/categories/data', 'CategoryController@data')->name('categories.data');
  Route::post('/categories/update-order', 'CategoryController@updateOrder')->name('categories.update-order');
  Route::post('/categories', 'CategoryController@store')->name('categories.store');
  Route::get('/categories/create', 'CategoryController@create')->name('categories.create');
  Route::put('/categories/{category?}/update', 'CategoryController@update')->name('categories.update');
  Route::delete('/categories/{category?}/delete', 'CategoryController@delete')->name('categories.delete');
  Route::get('/categories/{category?}', 'CategoryController@show')->name('categories.show');

  // Tags
  Route::get('/tags', 'TagController@index')->name('tags');
  Route::get('/tags/data', 'TagController@data')->name('tags.data');
  Route::post('/tags', 'TagController@store')->name('tags.store');
  Route::get('/tags/create', 'TagController@create')->name('tags.create');
  Route::put('/tags/{tag?}/update', 'TagController@update')->name('tags.update');
  Route::delete('/tags/{tag?}/delete', 'TagController@delete')->name('tags.delete');
  Route::get('/tags/{tag?}', 'TagController@show')->name('tags.show');

  // Layouts
  Route::post('/page-layouts', 'PageLayoutController@store')->name('pagelayouts.store');
  Route::get('/page-layouts', 'PageLayoutController@index')->name('pagelayouts');
  Route::get('/page-layouts/{pageLayout?}/show', 'PageLayoutController@show')->name('pagelayouts.show');
  Route::get('/page-layouts/data', 'PageLayoutController@data')->name('pagelayouts.data');
  Route::delete('/page-layouts/{pageLayout?}/delete', 'PageLayoutController@delete')->name('pagelayouts.delete');
  Route::get('/page-layouts/modal-data', 'PageLayoutController@modalData')->name('pagelayouts.modal.data');

  // Contents
  Route::post('/contents/{content?}/duplicate', 'ContentController@duplicate')->name('contents.duplicate');
  Route::get('/contents', 'ContentController@index')->name('contents');
  Route::get('/contents/data', 'ContentController@data')->name('contents.data');
  Route::get('/contents/modal-data', 'ContentController@modalData')->name('contents.modal.data');
  Route::get('/contents/pages-tree', 'ContentController@pagesTree')->name('contents.pages-tree');
  Route::post('/contents', 'ContentController@store')->name('contents.store');
  Route::get('/contents/show', 'ContentController@show')->name('contents.show');
  Route::get('/contents/page/create', 'ContentController@create')->name('contents.page.create');
  Route::get('/contents/{typology}/create', 'ContentController@create')->name('contents.create');
  Route::get('/contents/{content?}', 'ContentController@show')->name('contents.show');
  Route::put('/contents/{content?}/update', 'ContentController@update')->name('contents.update');
  Route::put('/contents/{content?}/publish', 'ContentController@publish')->name('contents.publish');
  Route::delete('/contents/{content?}/delete', 'ContentController@delete')->name('contents.delete');


  // Medias
  Route::get('/medias', 'MediaController@index')->name('medias.index');
  Route::get('/medias/data', 'MediaController@data')->name('medias.data');
  Route::post('/medias', 'MediaController@store')->name('medias.store');
  Route::get('/medias/{media?}', 'MediaController@show')->name('medias.show');
  Route::delete('/medias/{media?}/delete', 'MediaController@delete')->name('medias.delete');
  Route::put('/medias/{media?}/update', 'MediaController@update')->name('medias.update');


  Route::get('/settings', 'ArchitectController@settings')->name('settings');

  // Menu
  Route::get('/settings/menu', 'MenuController@index')->name('menu.index');
  Route::get('/settings/menu/data', 'MenuController@data')->name('menu.data');
  Route::get('/settings/menu/create', 'MenuController@create')->name('menu.create');
  Route::put('/settings/menu/store', 'MenuController@store')->name('menu.store');
  Route::get('/settings/menu/element/{id}', 'MenuController@element')->name('menu.element');
  Route::put('/settings/menu/{menu}/update', 'MenuController@update')->name('menu.update');
  Route::get('/settings/menu/{menu?}/tree', 'MenuController@elementsTree')->name('menu.show.tree');
  Route::get('/settings/menu/{menu?}', 'MenuController@show')->name('menu.show');
  Route::delete('/settings/menu/{menu?}/delete', 'MenuController@delete')->name('menu.delete');

  Route::get('/settings/menu/element/{id}', 'MenuController@element')->name('menu.element');

  // Typologies
  Route::get('/typologies', 'TypologyController@index')->name('typologies');
  Route::post('/typologies', 'TypologyController@store')->name('typologies.store');
  Route::get('/typologies/create', 'TypologyController@create')->name('typologies.create');
  Route::put('/typologies/{typology?}/update', 'TypologyController@update')->name('typologies.update');
  Route::delete('/typologies/{typology?}/delete', 'TypologyController@delete')->name('typologies.delete');
  Route::get('/typologies/{typology?}', 'TypologyController@show')->name('typologies.show');

  // Languages
  Route::get('/languages', 'LanguageController@index')->name('languages');
  Route::get('/languages/data', 'LanguageController@data')->name('languages.data');
  Route::post('/languages', 'LanguageController@store')->name('languages.store');
  Route::get('/languages/create', 'LanguageController@create')->name('languages.create');
  Route::put('/languages/{language?}/update', 'LanguageController@update')->name('languages.update');
  Route::delete('/languages/{language?}/delete', 'LanguageController@delete')->name('languages.delete');
  Route::get('/languages/{language?}', 'LanguageController@show')->name('languages.show');

  // Translations
  Route::get('/translations', 'TranslationController@index')->name('translations');
  Route::get('/translations/data', 'TranslationController@data')->name('translations.data');
  Route::post('/translations', 'TranslationController@store')->name('translations.store');
  Route::get('/translations/create', 'TranslationController@create')->name('translations.create');
  Route::post('/translations/update-order', 'TranslationController@updateOrder')->name('translations.order');
  Route::put('/translations/{translation?}/update', 'TranslationController@update')->name('translations.update');
  Route::delete('/translations/{translation?}/delete', 'TranslationController@delete')->name('translations.delete');
  Route::get('/translations/{translation?}', 'TranslationController@show')->name('translations.show');


  //added to all users FIXME separete account and users ?
  //Route::put('/users/{user?}/update', 'UserController@update')->name('users.update');
  //Route::get('/users/{user?}', 'UserController@show')->name('users.show');

});
