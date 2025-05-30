<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberCard>
 */
class MemberCardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'card_number' => 'MC' . now()->format('Ymd') . $this->faker->unique()->numerify('######'),
            'user_id' => User::factory(),
            'issued_by' => User::factory(),
        ];
    }
}
