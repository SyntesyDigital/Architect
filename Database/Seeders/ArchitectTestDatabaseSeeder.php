<?php

namespace Modules\Architect\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Role;
use Modules\Architect\Entities\Language;
use Modules\Architect\Entities\Typology;
use App\Models\Permission;

class ArchitectTestDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Language::create([
            'name' => 'Català',
            'iso' => 'ca'
        ]);

        Language::create([
            'name' => 'Español',
            'iso' => 'es'
        ]);

        Language::create([
            'name' => 'English',
            'iso' => 'en'
        ]);


        Model::unguard();
/*
        // Admin
        $adminRole = new Role();
        $adminRole->name         = 'admin';
        $adminRole->display_name = 'Admin'; // optional
        $adminRole->description  = ''; // optional
        $adminRole->save();


        // Editor
        $editorRole = new Role();
        $editorRole->name         = 'editor';
        $editorRole->display_name = 'Editor'; // optional
        $editorRole->description  = ''; // optional
        $editorRole->save();

        // Author
        $authorRole = new Role();
        $authorRole->name         = 'author';
        $authorRole->display_name = 'Author'; // optional
        $authorRole->description  = ''; // optional
        $authorRole->save();

        $admin = User::create([
            'email' => 'admin@bar.com',
            'password' => bcrypt('secret'),
            'firstname' => 'John',
            'lastname' => 'Admin',
        ]);
        $admin->attachRole($adminRole);

        $author = User::create([
            'email' => 'author@bar.com',
            'password' => bcrypt('secret'),
            'firstname' => 'John',
            'lastname' => 'Author',
        ]);
        $author->attachRole($authorRole);

        $editor = User::create([
            'email' => 'editor@bar.com',
            'password' => bcrypt('secret'),
            'firstname' => 'John',
            'lastname' => 'Editor',
        ]);
        $editor->attachRole($editorRole);
*/
    }
}
