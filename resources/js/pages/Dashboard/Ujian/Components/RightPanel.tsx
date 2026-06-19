interface RightPanelProps {
    sections: Array<{
        key: string;
        label: string;
        tag: string;
        questions: Array<{ id: string }>;
    }>;
    currentSectionIdx: number;
    currentQuestionIdx: number;
    onJumpTo: (secIdx: number, qIdx: number) => void;
    answersState: Record<string, string | null>;
    flaggedState: Record<string, boolean>;
    onSubmitClick: () => void;
}

export default function RightPanel({
    sections,
    currentSectionIdx,
    currentQuestionIdx,
    onJumpTo,
    answersState,
    flaggedState,
    onSubmitClick,
}: RightPanelProps) {
    let offset = 0;
    let totalQuestions = 0;
    let answeredCount = 0;
    let flaggedCount = 0;

    sections.forEach((sec) => {
        totalQuestions += sec.questions.length;
        sec.questions.forEach((q) => {
            if (answersState[q.id] !== undefined && answersState[q.id] !== null) {
                answeredCount++;
            }
            if (flaggedState[q.id]) {
                flaggedCount++;
            }
        });
    });

    const emptyCount = totalQuestions - answeredCount;
    const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    return (
        <div className="right-panel">
            <div className="right-panel-head">
                <div className="right-panel-title">Navigasi Soal</div>
                <div className="nav-legend">
                    <div className="legend-item">
                        <div
                            className="legend-box"
                            style={{
                                background: 'rgba(4,120,87,0.15)',
                                border: '1.5px solid rgba(4,120,87,0.3)',
                            }}
                        ></div>{' '}
                        Dijawab
                    </div>
                    <div className="legend-item">
                        <div className="legend-box" style={{ background: 'var(--indigo)' }}></div> Sekarang
                    </div>
                    <div className="legend-item">
                        <div
                            className="legend-box"
                            style={{
                                background: 'rgba(180,83,9,0.15)',
                                border: '1.5px solid rgba(180,83,9,0.3)',
                            }}
                        ></div>{' '}
                        Ditandai
                    </div>
                    <div className="legend-item">
                        <div
                            className="legend-box"
                            style={{
                                background: 'var(--bg-2)',
                                border: '1.5px solid var(--border)',
                            }}
                        ></div>{' '}
                        Belum
                    </div>
                </div>
            </div>

            <div className="num-grid-wrap" id="numGridWrap">
                {sections.map((sec, secIdx) => {
                    const sectionOffset = offset;
                    offset += sec.questions.length;

                    return (
                        <div className="section-group" key={sec.key}>
                            <div className="section-group-label">
                                {sec.label} — {sec.questions.length} Soal
                            </div>
                            <div className="num-grid">
                                {sec.questions.map((q, qIdx) => {
                                    const globalNum = sectionOffset + qIdx + 1;
                                    const isCurrent = secIdx === currentSectionIdx && qIdx === currentQuestionIdx;
                                    const isAnswered = answersState[q.id] !== undefined && answersState[q.id] !== null;
                                    const isFlagged = flaggedState[q.id];

                                    let cls = 'num-btn';
                                    if (isCurrent) {
                                        cls += ' current';
                                    } else if (isAnswered && isFlagged) {
                                        cls += ' answered flagged';
                                    } else if (isAnswered) {
                                        cls += ' answered';
                                    } else if (isFlagged) {
                                        cls += ' flagged';
                                    }

                                    return (
                                        <button
                                            key={q.id}
                                            className={cls}
                                            onClick={() => onJumpTo(secIdx, qIdx)}
                                        >
                                            {globalNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="right-panel-foot">
                <div className="progress-block">
                    <div className="prog-label-row">
                        <span className="prog-label-txt">Progres</span>
                        <span className="prog-label-val">
                            {answeredCount} / {totalQuestions}
                        </span>
                    </div>
                    <div className="prog-track">
                        <div
                            className="prog-fill"
                            style={{ width: `${progressPct}%` }}
                        ></div>
                    </div>
                </div>
                <div className="score-preview">
                    <div className="score-preview-row">
                        <span>Dijawab</span>
                        <span className="score-val green">{answeredCount}</span>
                    </div>
                    <div className="score-preview-row">
                        <span>Ditandai</span>
                        <span className="score-val amber">{flaggedCount}</span>
                    </div>
                    <div className="score-preview-row">
                        <span>Belum dijawab</span>
                        <span className="score-val">{emptyCount}</span>
                    </div>
                </div>
                <button className="btn-submit-full" onClick={onSubmitClick}>
                    Kumpulkan Jawaban ✓
                </button>
            </div>
        </div>
    );
}
