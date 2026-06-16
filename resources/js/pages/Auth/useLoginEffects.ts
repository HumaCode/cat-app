import { useState } from 'react';

export default function useLoginEffects() {
    const [pwdVisible, setPwdVisible] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    const togglePwd = () => setPwdVisible((prev) => !prev);

    const triggerSuccessOverlay = (callback?: () => void) => {
        setShowSuccess(true);
        if (callback) {
            setTimeout(callback, 1800);
        }
    };

    const handleFocus = (field: string) => {
        setFocusedFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusedFields((prev) => ({ ...prev, [field]: false }));
    };

    return {
        pwdVisible,
        togglePwd,
        showSuccess,
        triggerSuccessOverlay,
        focusedFields,
        handleFocus,
        handleBlur,
    };
}
