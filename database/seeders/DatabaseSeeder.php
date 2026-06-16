<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Institusi Default
        $institution = \App\Models\Institution::create([
            'name' => 'Panitia Pusat Cerdas Cermat',
            'slug' => 'panitia-pusat',
            'subscription_plan' => 'professional',
        ]);

        // 2. Buat Admin User
        User::factory()->admin()->create([
            'name' => 'Admin Utama',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'institution_id' => $institution->id,
        ]);

        // 3. Buat Proctor User (Pengawas)
        User::factory()->proctor()->create([
            'name' => 'Pengawas Satu',
            'username' => 'proctor',
            'email' => 'proctor@example.com',
            'institution_id' => $institution->id,
        ]);

        // 4. Buat Peserta User
        User::factory()->create([
            'name' => 'Peserta Ujian',
            'username' => 'peserta',
            'email' => 'peserta@example.com',
            'institution_id' => $institution->id,
        ]);
    }
}
