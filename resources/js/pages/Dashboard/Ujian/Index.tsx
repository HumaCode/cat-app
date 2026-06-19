import { useEffect, useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import '@/../../resources/css/ujian-peserta.css';

// Component Partials
import IntroOverlay from './Components/IntroOverlay';
import ExamTopBar from './Components/ExamTopBar';
import SectionNavBar from './Components/SectionNavBar';
import QuestionBody from './Components/QuestionBody';
import RightPanel from './Components/RightPanel';
import SubmitModal from './Components/SubmitModal';
import ResultOverlay from './Components/ResultOverlay';
import ViolationToast from './Components/ViolationToast';

interface QuestionOption {
    id: string;
    text: string;
    pair_text?: string;
}

interface Question {
    id: string;
    text: string;
    type?: string;
    difficulty: string;
    points: number;
    correct_option_id: string | null;
    correct_option_ids?: string[];
    correct_answers?: string[];
    options: QuestionOption[];
}

interface Section {
    key: string;
    label: string;
    color: string;
    tag: string;
    soal_count: number;
    questions: Question[];
}

interface Exam {
    id: string;
    title: string;
    type: string;
    duration: number;
    institution: string;
    settings: {
        passing_grade: number;
        lockdown_mode: boolean;
        activity_logging: boolean;
    };
}

interface User {
    id: number;
    name: string;
}

interface ExamIndexProps {
    exam: Exam;
    sections: Section[];
    user: User;
}

export default function ExamIndex({ exam, sections = [], user }: ExamIndexProps) {
    const [examStarted, setExamStarted] = useState(false);
    const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

    // Answers and Flagged states mapped by Question ID
    const [answersState, setAnswersState] = useState<Record<string, string | null>>({});
    const [flaggedState, setFlaggedState] = useState<Record<string, boolean>>({});

    // Timer state
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.duration * 60);

    // Modal and Overlay state
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [resultOverlayOpen, setResultOverlayOpen] = useState(false);

    // Violation & Warning state
    const [violationCount, setViolationCount] = useState(0);
    const [violationMsg, setViolationMsg] = useState('');
    const [showViolationToast, setShowViolationToast] = useState(false);

    // Timeout ref for auto-next transition
    const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    // Flattened questions list to count totals
    const totalQuestions = sections.reduce((acc, sec) => acc + sec.questions.length, 0);

    // Get current section and current question safely
    const currentSection = sections[currentSectionIdx] || null;
    const currentQuestion = currentSection?.questions[currentQuestionIdx] || null;

    // Helper: calculate global index of the current question
    const getGlobalIndex = () => {
        let count = 0;
        for (let i = 0; i < currentSectionIdx; i++) {
            count += sections[i].questions.length;
        }
        return count + currentQuestionIdx;
    };

    // Trigger toast message
    const triggerViolation = (msg: string) => {
        setViolationMsg(msg);
        setShowViolationToast(true);
    };

    // Close toast after delay
    useEffect(() => {
        if (showViolationToast) {
            const timer = setTimeout(() => {
                setShowViolationToast(false);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [showViolationToast]);

    // Timer countdown loop
    useEffect(() => {
        if (!examStarted || resultOverlayOpen) return;

        const timer = setInterval(() => {
            setTimeLeftSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // auto submit exam
                    triggerViolation('⏰ Waktu habis! Jawaban dikumpulkan otomatis.');
                    setTimeout(() => {
                        setResultOverlayOpen(true);
                    }, 1200);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examStarted, resultOverlayOpen]);

    // Anti-cheat mechanisms (lockdown & security behavior)
    useEffect(() => {
        if (!examStarted || resultOverlayOpen || !exam.settings.lockdown_mode) return;

        // Visibility / Tab Change detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolationCount((prev) => {
                    const newCount = prev + 1;
                    triggerViolation(`⚠️ Peringatan ${newCount}: Jangan berpindah tab selama ujian!`);
                    return newCount;
                });
            }
        };

        // Context Menu / Right click prevention
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            triggerViolation('🚫 Klik kanan dinonaktifkan selama ujian.');
        };

        // Keydown copy/paste & devtools protection
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (e.ctrlKey && ['c', 'v', 'a', 'u'].includes(key)) {
                e.preventDefault();
                triggerViolation('🚫 Menyalin/menempel teks tidak diperbolehkan selama ujian.');
            }
            if (e.key === 'F12') {
                e.preventDefault();
                triggerViolation('🚫 Developer tools dinonaktifkan.');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [examStarted, resultOverlayOpen, exam.settings.lockdown_mode]);

    // Handlers
    const handleStartExam = () => {
        setExamStarted(true);
    };

    const handleSelectOption = (value: string) => {
        if (!currentQuestion) return;

        const qType = currentQuestion.type || 'pg';
        const isPgk = qType === 'pgk';

        setAnswersState((prev) => {
            const currentAnswer = prev[currentQuestion.id] || '';
            let newAnswer = '';

            if (isPgk) {
                // Toggle optionId in the comma-separated list
                const selectedList = currentAnswer ? currentAnswer.split(',').filter(Boolean) : [];
                if (selectedList.includes(value)) {
                    newAnswer = selectedList.filter(id => id !== value).join(',');
                } else {
                    selectedList.push(value);
                    newAnswer = selectedList.join(',');
                }
            } else {
                newAnswer = value;
            }

            return {
                ...prev,
                [currentQuestion.id]: newAnswer,
            };
        });

        // Automatically move to the next question ONLY if it is a single-choice question (pg, tf)
        if (qType === 'pg' || qType === 'tf') {
            if (autoNextTimeoutRef.current) {
                clearTimeout(autoNextTimeoutRef.current);
            }

            if (!isLastQuestion) {
                autoNextTimeoutRef.current = setTimeout(() => {
                    handleNext();
                }, 300); // 300ms delay
            }
        }
    };


    const handleToggleFlag = () => {
        if (!currentQuestion) return;
        setFlaggedState((prev) => ({
            ...prev,
            [currentQuestion.id]: !prev[currentQuestion.id],
        }));
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx((prev) => prev - 1);
        } else if (currentSectionIdx > 0) {
            const prevSectionIdx = currentSectionIdx - 1;
            const prevSection = sections[prevSectionIdx];
            setCurrentSectionIdx(prevSectionIdx);
            setCurrentQuestionIdx(prevSection.questions.length - 1);
        }
    };

    const handleNext = () => {
        if (!currentSection) return;
        if (currentQuestionIdx < currentSection.questions.length - 1) {
            setCurrentQuestionIdx((prev) => prev + 1);
        } else if (currentSectionIdx < sections.length - 1) {
            setCurrentSectionIdx((prev) => prev + 1);
            setCurrentQuestionIdx(0);
        }
    };

    const handleJumpTo = (secIdx: number, qIdx: number) => {
        setCurrentSectionIdx(secIdx);
        setCurrentQuestionIdx(qIdx);
    };

    const handleSubmitExam = () => {
        setSubmitModalOpen(false);
        setResultOverlayOpen(true);
    };

    const handleReturnToDashboard = () => {
        let totalQuestions = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let emptyCount = 0;

        sections.forEach((sec) => {
            totalQuestions += sec.questions.length;
            sec.questions.forEach((q) => {
                const answer = answersState[q.id];
                if (answer === undefined || answer === null || answer === '') {
                    emptyCount++;
                } else {
                    if (qType === 'isian') {
                        const userAnswerNormalized = answer.trim().toLowerCase();
                        const correctTexts = q.correct_answers || [];
                        const isCorrect = correctTexts.includes(userAnswerNormalized);
                        if (isCorrect) {
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    } else if (qType === 'jodoh') {
                        const matches = answer.split(',').reduce((acc, pairStr) => {
                            const [optId, val] = pairStr.split(':');
                            if (optId) acc[optId] = val;
                            return acc;
                        }, {} as Record<string, string>);

                        const isCorrect = q.options.every((opt) => {
                            const userPair = matches[opt.id];
                            return userPair && userPair.trim().toLowerCase() === (opt.pair_text || '').trim().toLowerCase();
                        });

                        if (isCorrect) {
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    } else if (qType === 'urutan') {
                        const selectedIds = answer.split(',').filter(Boolean);
                        const correctIds = q.correct_option_ids || [];
                        const isCorrect = selectedIds.length === correctIds.length && selectedIds.every((val, index) => val === correctIds[index]);
                        if (isCorrect) {
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    } else if (qType === 'essay') {
                        if (answer.trim().length > 0) {
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    } else if (qType === 'pgk' || q.correct_option_ids) {
                        const selectedIds = answer.split(',').filter(Boolean).sort();
                        const correctIds = q.correct_option_ids ? q.correct_option_ids.filter(Boolean).sort() : (q.correct_option_id ? [q.correct_option_id] : []);
                        const isCorrect = selectedIds.length === correctIds.length && selectedIds.every((val, index) => val === correctIds[index]);
                        if (isCorrect) {
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    } else {
                        if (q.correct_option_id && answer === q.correct_option_id) {
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    }
                }
            });
        });

        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100 * 10) / 10 : 0;
        const isPassed = score >= exam.settings.passing_grade;

        router.post(route('peserta.ujian.submit', { examId: exam.id }), {
            score: score,
            is_passed: isPassed
        });
    };

    const isLastQuestion =
        currentSectionIdx === sections.length - 1 &&
        currentQuestionIdx === (currentSection?.questions.length || 0) - 1;

    const hasPrev = currentSectionIdx > 0 || currentQuestionIdx > 0;

    return (
        <>
            <Head title={`${exam.title} | CAT System`} />

            {/* Intro countdown / screen overlay */}
            <IntroOverlay
                examTitle={exam.title}
                totalQuestions={totalQuestions}
                duration={exam.duration}
                passingGrade={exam.settings.passing_grade}
                sectionsCount={sections.length}
                onStart={handleStartExam}
            />

            {/* Topbar Info & controls */}
            <ExamTopBar
                examTitle={exam.title}
                institutionName={exam.institution}
                userName={user.name}
                timeLeftSeconds={timeLeftSeconds}
                isCurrentFlagged={currentQuestion ? !!flaggedState[currentQuestion.id] : false}
                onToggleFlag={handleToggleFlag}
                onSubmitClick={() => setSubmitModalOpen(true)}
            />

            {/* Section tabs navigation */}
            <SectionNavBar
                sections={sections}
                currentSectionIdx={currentSectionIdx}
                onSectionSelect={(idx) => {
                    setCurrentSectionIdx(idx);
                    setCurrentQuestionIdx(0);
                }}
                answersState={answersState}
                flaggedState={flaggedState}
            />

            {/* Main grid area */}
            <div className="exam-wrap">
                {/* Question panel with actions */}
                <QuestionBody
                    question={currentQuestion}
                    globalIndex={getGlobalIndex()}
                    totalQuestions={totalQuestions}
                    sectionTag={currentSection?.tag || 'twk'}
                    sectionLabel={currentSection?.label || 'TWK'}
                    currentAnswer={currentQuestion ? answersState[currentQuestion.id] || null : null}
                    onSelectOption={handleSelectOption}
                    isCurrentFlagged={currentQuestion ? !!flaggedState[currentQuestion.id] : false}
                    onToggleFlag={handleToggleFlag}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    hasPrev={hasPrev}
                    isLastQuestion={isLastQuestion}
                    onSubmitClick={() => setSubmitModalOpen(true)}
                />

                {/* Right sidebar navigation grid */}
                <RightPanel
                    sections={sections}
                    currentSectionIdx={currentSectionIdx}
                    currentQuestionIdx={currentQuestionIdx}
                    onJumpTo={handleJumpTo}
                    answersState={answersState}
                    flaggedState={flaggedState}
                    onSubmitClick={() => setSubmitModalOpen(true)}
                />
            </div>

            {/* Violation Alert Toast */}
            <ViolationToast
                message={violationMsg}
                show={showViolationToast}
            />

            {/* Confirm Submission Modal */}
            <SubmitModal
                isOpen={submitModalOpen}
                onClose={() => setSubmitModalOpen(false)}
                onSubmit={handleSubmitExam}
                sections={sections}
                answersState={answersState}
                flaggedState={flaggedState}
            />

            {/* Final Exam Results / Scores screen */}
            <ResultOverlay
                isOpen={resultOverlayOpen}
                sections={sections}
                answersState={answersState}
                examTitle={exam.title}
                passingGrade={exam.settings.passing_grade}
                onReturnToDashboard={handleReturnToDashboard}
            />
        </>
    );
}
