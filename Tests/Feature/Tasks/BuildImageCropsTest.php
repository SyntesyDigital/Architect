<?php

namespace Modules\Architect\Tests\Feature\Tasks;

use Modules\Architect\Tests\TestCase;

use Modules\Architect\Tasks\Media\BuildImageCrops;
use Intervention\Image\ImageManagerStatic as Image;

class BuildImageCropsTest extends TestCase
{

    public $filePathHorizontal = __DIR__  . '/image_horizontal.jpg';
    public $filePathVertical = __DIR__  . '/image_vertical.jpg';
    public $filePathSquared = __DIR__  . '/image_squared.jpg';

    public function testImageHorizontal()
    {
        (new BuildImageCrops($this->filePathHorizontal))->run();

        $original = Image::make($this->filePathHorizontal);

        echo 'Original (horizontal) : ' . $original->width() . 'x' . $original->height() . PHP_EOL;

        // Build others image formats
        foreach(config('images.formats') as $format) {
            $path = sprintf('%s/app/%s/%s/%s',
                storage_path(),
                config('images.storage_directory'),
                $format['directory'],
                basename($this->filePathHorizontal)
            );

            // Test if crops is created
            $this->assertFileExists($path);

            // Test crop format
            $image = Image::make($path);

            echo $format["name"] . ' ('.$format["width"].'x'.$format["height"].') : ' . $image->width() . 'x' . $image->height() . PHP_EOL;

            unlink($path);
        }

        echo PHP_EOL;
    }

    public function testImageVertical()
    {
        (new BuildImageCrops($this->filePathVertical))->run();

        $original = Image::make($this->filePathVertical);

        echo 'Original (vertical) : ' . $original->width() . 'x' . $original->height() . PHP_EOL;

        // Build others image formats
        foreach(config('images.formats') as $format) {
            $path = sprintf('%s/app/%s/%s/%s',
                storage_path(),
                config('images.storage_directory'),
                $format['directory'],
                basename($this->filePathVertical)
            );

            // Test if crops is created
            $this->assertFileExists($path);

            // Test crop format
            $image = Image::make($path);

            echo $format["name"] . ' ('.$format["width"].'x'.$format["height"].') : ' . $image->width() . 'x' . $image->height() . PHP_EOL;

            unlink($path);
        }

        echo PHP_EOL;
    }

    public function testImageSquare()
    {
        (new BuildImageCrops($this->filePathSquared))->run();

        $original = Image::make($this->filePathSquared);

        echo 'Original (vertical) : ' . $original->width() . 'x' . $original->height() . PHP_EOL;

        // Build others image formats
        foreach(config('images.formats') as $format) {
            $path = sprintf('%s/app/%s/%s/%s',
                storage_path(),
                config('images.storage_directory'),
                $format['directory'],
                basename($this->filePathSquared)
            );

            // Test if crops is created
            $this->assertFileExists($path);

            // Test crop format
            $image = Image::make($path);

            echo $format["name"] . ' ('.$format["width"].'x'.$format["height"].') : ' . $image->width() . 'x' . $image->height() . PHP_EOL;

            unlink($path);
        }

        echo PHP_EOL;
    }
}
