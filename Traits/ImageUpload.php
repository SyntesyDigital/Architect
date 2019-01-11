<?php

namespace Modules\Architect\Traits;
use Storage;

trait ImageUpload
{
    public function getAttribute($key)
    {
        return parent::getAttribute($key);
    }

    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->imagesUpload)) {
            $imageUploadRepository = \App::make('\Modules\Architect\Repositories\ImageUploadRepository');

            $originalImage = isset($this->original[$key]) ? $this->original[$key] : null;

            if ($value != $originalImage) {
                if (null != $originalImage) {
                    $imageUploadRepository->delete($originalImage);
                }

                if ('' != $value && null != $value) {
                    $storagePath = $imageUploadRepository->move($value, $this->table . '/');
                }

                $value = isset($storagePath) ? $storagePath : null;
            }
        }

        return parent::setAttribute($key, $value);
    }
}
