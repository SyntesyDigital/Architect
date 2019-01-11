<?php

return [
    [
        "route" => 'typologies',
        "icon" => "fa-th",
        "label" => Lang::get('architect::settings.typologies'),
        "roles" => ["admin"]
    ],
    [
        "route" => 'users',
        "icon" => "fa-users",
        "label" => Lang::get('architect::settings.users'),
    ],

    [
        "route" => 'languages',
        "icon" => "fa-flag",
        "label" => Lang::get('architect::settings.languages'),
    ],

    [
        "route" => 'translations',
        "icon" => "fa-list-alt",
        "label" => Lang::get('architect::settings.translations'),
    ],

    [
        "route" => 'menu.index',
        "icon" => "fa-list",
        "label" => Lang::get('architect::settings.menu'),
    ],

    [
        "route" => 'pagelayouts',
        "icon" => "fa-columns",
        "label" => Lang::get('architect::settings.templates'),
    ]
];
