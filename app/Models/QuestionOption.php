<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class QuestionOption extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
        'order_column',
        'pair_text',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'order_column' => 'integer',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('media_opsi')
            ->singleFile();
    }
}
