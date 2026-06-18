<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Institution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institution = Institution::first();
        if (!$institution) {
            $institution = Institution::create([
                'name' => 'Panitia Pusat Cerdas Cermat',
                'slug' => 'panitia-pusat',
                'subscription_plan' => 'professional',
            ]);
        }

        $cats = [
            [
                'name' => 'TWK',
                'icon' => '🏛️',
                'ch' => [
                    ['name' => 'Nasionalisme', 'icon' => '🇮🇩'],
                    ['name' => 'Integritas', 'icon' => '⚖️'],
                    ['name' => 'Bela Negara', 'icon' => '🎖️'],
                    ['name' => 'Pancasila & UUD', 'icon' => '📜'],
                    ['name' => 'Bhinneka Tunggal Ika', 'icon' => '🕊️'],
                ]
            ],
            [
                'name' => 'TIU',
                'icon' => '🧠',
                'ch' => [
                    ['name' => 'Kemampuan Verbal', 'icon' => '💬'],
                    ['name' => 'Kemampuan Numerik', 'icon' => '🔢'],
                    ['name' => 'Kemampuan Logis', 'icon' => '🔗'],
                    ['name' => 'Kemampuan Spasial', 'icon' => '📐'],
                ]
            ],
            [
                'name' => 'TKP',
                'icon' => '🤝',
                'ch' => [
                    ['name' => 'Sosial Budaya', 'icon' => '🌐'],
                    ['name' => 'Pelayanan Publik', 'icon' => '🏢'],
                    ['name' => 'Profesionalisme', 'icon' => '💼'],
                    ['name' => 'Anti Korupsi', 'icon' => '🛡️'],
                ]
            ],
            [
                'name' => 'Diklat & Kompetensi',
                'icon' => '📚',
                'ch' => [
                    ['name' => 'Kompetensi IT', 'icon' => '💻'],
                    ['name' => 'Manajemen ASN', 'icon' => '📋'],
                    ['name' => 'Lainnya', 'icon' => '📄'],
                ]
            ],
        ];

        foreach ($cats as $idx => $cData) {
            $parent = Category::create([
                'institution_id' => $institution->id,
                'name' => $cData['name'],
                'icon' => $cData['icon'],
                'slug' => Str::slug($cData['name']),
                'order_column' => $idx,
            ]);

            foreach ($cData['ch'] as $cidx => $chData) {
                Category::create([
                    'institution_id' => $institution->id,
                    'parent_id' => $parent->id,
                    'name' => $chData['name'],
                    'icon' => $chData['icon'],
                    'slug' => Str::slug($chData['name']),
                    'order_column' => $cidx,
                ]);
            }
        }
    }
}
