<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableMediasAddUploadedByField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('medias', function($table){
            $table->integer('author_id')->unsigned()->after('metadata');
            $table->foreign('author_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Schema::table('medias', function($table){
            $table->dropForeign('medias_author_id_foreign');
            $table->dropColumn('author_id');
        });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
