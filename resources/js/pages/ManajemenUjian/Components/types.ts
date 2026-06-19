export interface ExamItem {
    id: string;
    title: string;
    type: string;
    duration: number;
    passing_grade: number;
    start_time: string | null;
    end_time: string | null;
    instructions: string | null;
    category_id: string | null;
    settings: {
        show_results?: boolean;
        show_answers?: boolean;
        shuffle_questions?: boolean;
        shuffle_options?: boolean;
        lockdown_mode?: boolean;
        activity_logging?: boolean;
        attempts_limit?: number;
        access_type?: string;
        passing_grade_type?: string;
        participant_method?: string;
        filter_institution?: string;
        quota?: number;
        seksi?: Array<{
            title: string;
            category_id?: string;
            icon: string;
            soal_count: number;
            duration: number;
            correct_points: number;
            incorrect_points: number;
            passing_grade?: number;
            status: string;
        }>;
        participants?: string[];
    };
    status: 'aktif' | 'terjadwal' | 'draft' | 'selesai';
    created_at: string;
    updated_at: string;
}

export interface CategoryItem {
    id: string;
    name: string;
    icon: string;
    slug: string;
}
