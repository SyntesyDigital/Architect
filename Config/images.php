<?php

return [
    'storage_directory' => 'public/medias',

    'display' => 'thumbnail',

    'formats' => [
        [
            'name' => 'large',
            'directory' => 'large',
            'ratio' => '',
            'width' => 1366,
            'height' => 650
        ],
        [
            'name' => 'medium',
            'directory' => 'medium',
            'ratio' => '16:9',
            'width' => 768,
            'height' => 432
        ],
        [
            'name' => 'small',
            'directory' => 'small',
            'ratio' => '16:9',
            'width' => 480,
            'height' => 270
        ],
        [
            'name' => 'thumbnail',
            'directory' => 'thumbnail',
            'ratio' => '1:1',
            'width' => 225,
            'height' => 225
        ]
    ]

];
