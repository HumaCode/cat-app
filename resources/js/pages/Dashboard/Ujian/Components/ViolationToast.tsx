interface ViolationToastProps {
    message: string;
    show: boolean;
}

export default function ViolationToast({ message, show }: ViolationToastProps) {
    return (
        <div className={`violation-toast ${show ? 'show' : ''}`} id="violationToast">
            ⚠️ <span id="violationMsg">{message}</span>
        </div>
    );
}
