interface SectionNavBarProps {
    sections: Array<{
        key: string;
        label: string;
        tag: string;
        questions: Array<{ id: string }>;
    }>;
    currentSectionIdx: number;
    onSectionSelect: (idx: number) => void;
    answersState: Record<string, string | null>;
    flaggedState: Record<string, boolean>;
}

export default function SectionNavBar({
    sections,
    currentSectionIdx,
    onSectionSelect,
    answersState,
    flaggedState,
}: SectionNavBarProps) {
    return (
        <div className="section-navbar">
            {sections.map((sec, idx) => {
                // calculate answered and flagged count
                let doneCount = 0;
                let flagCount = 0;

                sec.questions.forEach((q) => {
                    if (answersState[q.id] !== undefined && answersState[q.id] !== null) {
                        doneCount++;
                    }
                    if (flaggedState[q.id]) {
                        flagCount++;
                    }
                });

                const isActive = idx === currentSectionIdx;

                return (
                    <div key={sec.key} style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            className={`section-tab ${isActive ? 'active' : ''}`}
                            onClick={() => onSectionSelect(idx)}
                        >
                            {sec.label}
                            <div className="section-counts">
                                <span className="scount done">
                                    {doneCount}/{sec.questions.length}
                                </span>
                                {flagCount > 0 && (
                                    <span className="scount flag">
                                        {flagCount}🚩
                                    </span>
                                )}
                            </div>
                            <div className="section-tab-progress"></div>
                        </div>
                        {idx < sections.length - 1 && (
                            <div className="section-divider"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
