<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableContentAddParentIdField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contents', function($table){
            // $table->integer('parent_id')->unsigned()->nullable();
            // $table->foreign('parent_id')->references('id')->on('contents');

            $table->nestedSet();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('contents', function($table){
            // $table->dropForeign('contents_parent_id_foreign');
            // $table->dropColumn('parent_id');
            $table->dropNestedSet();
        });

        Schema::enableForeignKeyConstraints();
    }
}
