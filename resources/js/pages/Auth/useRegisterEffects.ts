import { useState } from 'react';

export default function useRegisterEffects() {
    const [pwdVisible, setPwdVisible] = useState(false);
    const [pwdConfirmVisible, setPwdConfirmVisible] = useState(false);
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    const togglePwd = () => setPwdVisible((prev) => !prev);
    const togglePwdConfirm = () => setPwdConfirmVisible((prev) => !prev);

    const handleFocus = (field: string) => {
        setFocusedFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusedFields((prev) => ({ ...prev, [field]: false }));
    };

    return {
        pwdVisible,
        togglePwd,
        pwdConfirmVisible,
        togglePwdConfirm,
        focusedFields,
        handleFocus,
        handleBlur,
    };
}
