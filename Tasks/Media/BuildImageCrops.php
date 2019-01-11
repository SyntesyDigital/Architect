<?php

namespace Modules\Architect\Tasks\Media;

use Intervention\Image\ImageManagerStatic as Image;
use Storage;

class BuildImageCrops
{
    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    public function run()
    {
        // Build others image formats
        foreach(config('images.formats') as $format) {

            $image = Image::make($this->filePath);

            $cropRatio = $format["width"]/$format["height"];
            $imageRatio = $image->width()/$image->height();

            //image is bigger than the crop, is crop
            $width = $format["width"];
            $height = $format["height"];

            if($cropRatio > $imageRatio){
              //width is the limit
              if($format["width"] > $image->width()){
                //image is small than crop
                $width = $image->width();
                $height = round($image->width()/$cropRatio);
              }
            }
            else {
              //height is the limit
              if($format["height"] > $image->height()){
                //image is small than crop
                $height = $image->height();
                $width = round($image->height()*$cropRatio);
              }
            }

            $imageData = $image
                ->fit($width, $height)
                //->crop($width, $height)
                ->encode();

            $path = sprintf('%s/%s/%s',
                config('images.storage_directory'),
                $format['directory'],
                basename($this->filePath)
            );

            Storage::put($path, (string) $imageData);
        }
    }

}
