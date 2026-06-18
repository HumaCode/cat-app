<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'institution_id',
        'user_id',
        'category_id',
        'title',
        'type',
        'duration',
        'passing_grade',
        'start_time',
        'end_time',
        'instructions',
        'settings',
        'status',
    ];

    protected $casts = [
        'duration' => 'integer',
        'passing_grade' => 'integer',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'settings' => 'array',
    ];

    /**
     * Get the institution that owns the exam.
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Get the user who created the exam.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the category of the exam.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
