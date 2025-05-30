<?php

namespace Database\Seeders;

use App\Models\MemberCard;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberCardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MemberCard::factory()->count(5)->create();
    }
}
