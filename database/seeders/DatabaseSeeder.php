<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\MemberCard;
use App\Models\Store;
use App\Models\User;
use Database\Factories\StoreFactory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // StoreFactory::resetStoreNumber();
        // Store::factory()->count(5)->create();
        // Division::factory()->count(5)->create();
        User::factory()->count(5)->create();
        // MemberCard::factory()->count(5)->create();
    }
}
