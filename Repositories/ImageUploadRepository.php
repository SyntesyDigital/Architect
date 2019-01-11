<?php

namespace Modules\Architect\Repositories;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

use Intervention\Image\ImageManager;

use Storage;
use Lang;
/**
 * Interface UsersRepository.
 */
class ImageUploadRepository
{
    public static $rules = [
        'file' => 'required|mimes:png,gif,jpeg,jpg,bmp',
    ];

    public static $messages = [
      'file.mimes' => 'Format de fichier invalide',
      'file.required' => 'Fichier manquant',
    ];

    public function upload($form_data, $resizeWidth = null)
    {
        $validator = Validator::make(
            $form_data,
            self::$rules,
            self::$messages
        );

        if ($validator->fails()) {
            return [
                'error' => true,
                'message' => $validator->messages()->first(),
            ];
        }

        $photo = $form_data['file'];
        $originalName = $photo->getClientOriginalName();
        $extension = $photo->getClientOriginalExtension();
        $originalNameWithoutExt = substr($originalName, 0, strlen($originalName) - strlen($extension) - 1);

        $allowed_filename = uniqid(rand(), false) . '.' . $extension;

        $prefix = 'public/cache/' . date('Y').'/'.date('m').'/';

        $result = $this->processImageSize($photo, $allowed_filename, $resizeWidth, $prefix);

        if (! $result) {
            return [
                'error' => true,
                'message' => Lang::get("architect::fields.error"),
            ];
        }

        return [
            'error' => false,
            'filename' => $prefix.$allowed_filename,
            'storage_filename' => Storage::url($prefix.$allowed_filename),
        ];
    }

    /**
     * Create Icon From Original.
     */
    public function processImageSize($photo, $filename, $resizeWidth = null, $prefix = '')
    {
        $manager = new ImageManager();

        if (null != $resizeWidth) {
            $image = $manager->make($photo)->resize($resizeWidth, null, function ($constraint) {
                $constraint->aspectRatio();
            });
        } else {
            $image = $manager->make($photo);
        }

        // calculate md5 hash of encoded image
        $hash = md5($image->__toString());

        // use hash as a name
        $path = "cache/{$hash}.jpg";

        // save it locally to ~/public/images/{$hash}.jpg
        $image->save(public_path($path));

        Storage::put($prefix.$filename, $image->__toString());

        //delete temporal image
        $image->destroy();

        unlink($path);

        return true;
    }

    public function move($tmpFilename, $endPath)
    {
        $filename = explode('/', $tmpFilename);
        $filename = $filename[sizeof($filename) - 1];

        Storage::move($tmpFilename,'public/' . $endPath.$filename);

        return $endPath.$filename;
    }

    public function delete($file)
    {
        return Storage::has($file) ? Storage::delete($file) : false;
    }
}
