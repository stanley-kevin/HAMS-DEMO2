import { useState } from 'react';

const EMERGENCY_NUMBER = '+919994404779';

export default function EmergencyCall() {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleButtonClick = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        window.location.href = `tel:${EMERGENCY_NUMBER}`;
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    return (
        <>
            {/* Floating Emergency Button */}
            <button
                id="emergency-call-btn"
                className="emergency-call-btn"
                onClick={handleButtonClick}
                aria-label="Emergency Call"
            >
                <span className="emergency-call-icon">📞</span>
                <span className="emergency-call-text">Emergency Call</span>
            </button>

            {/* Confirmation Modal Overlay */}
            {showConfirm && (
                <div className="emergency-overlay" role="dialog" aria-modal="true" aria-labelledby="emergency-dialog-title">
                    <div className="emergency-dialog">
                        <div className="emergency-dialog-icon">🚨</div>
                        <h2 id="emergency-dialog-title">Emergency Call</h2>
                        <p>Do you want to call emergency support?</p>
                        <p className="emergency-number">{EMERGENCY_NUMBER}</p>
                        <div className="emergency-dialog-actions">
                            <button
                                className="emergency-dialog-cancel"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <a
                                href={`tel:${EMERGENCY_NUMBER}`}
                                className="emergency-dialog-confirm"
                                onClick={handleConfirm}
                            >
                                📞 Call Now
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
