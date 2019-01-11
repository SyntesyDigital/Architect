<?php

return [

    'text' => [
        'name' => 'Text',
        'rules' => ['required', 'unique', 'min', 'max'],
        'settings' => []
    ],

    'image' => [
        'name' => 'Image',
        'rules' => ['required'],
        'settings' => []
    ],

    'date' => [
        'name' => 'Date',
        'rules' => ['required'],
        'settings' => []
    ],

    'location' => [
        'name' => 'Location',
        'rules' => ['required'],
        'settings' => []
    ],

];
