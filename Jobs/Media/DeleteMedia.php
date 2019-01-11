<?php

namespace Modules\Architect\Jobs\Media;

use Modules\Architect\Http\Requests\Media\DeleteMediaRequest;
use Modules\Architect\Entities\Media;
use Storage;

class DeleteMedia
{
    public function __construct(Media $media)
    {
        $this->media = $media;
    }

    public static function fromRequest(DeleteMediaRequest $request)
    {
        return new self(Media::find($request->get('id')));
    }

    public function handle()
    {
        switch($this->media->type) {
            case "image":
                // Remove original
                $files[] = sprintf('%s/%s/%s',
                    config('images.storage_directory'),
                    'original',
                    $this->media->stored_filename
                );

                // Remove all formats
                foreach(config('images.formats') as $format) {
                    $files[] = sprintf('%s/%s/%s',
                        config('images.storage_directory'),
                        $format['directory'],
                        $this->media->stored_filename
                    );
                }


            break;

            default:
                $files[] = sprintf('%s/%s/%s',
                    config('medias.storage_directory'),
                    'files',
                    $this->media->stored_filename
                );
            break;
        }

        foreach($files as $file) {
            Storage::has($file) ? Storage::delete($file) : null;
        }

        return $this->media->delete();
    }
}
