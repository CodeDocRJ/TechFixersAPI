const generateOTP = require('../utils/otpGenerator');

class OTPService {
    constructor() {
        this.otpMap = new Map();
    }

    generateAndSaveOTP(phoneNo) {
        const otp = generateOTP();
        this.otpMap.set(phoneNo, { otp, timestamp: Date.now() });
        setTimeout(() => {
            this.otpMap.delete(phoneNo);
        }, 5 * 60 * 1000); // OTP expires after 5 minutes
        return otp;
    }

    verifyOTP(phoneNo, otp) {
        const otpDetails = this.otpMap.get(phoneNo);
        if (!otpDetails || otpDetails.otp !== otp) {
            return false;
        }
        const currentTime = Date.now();
        if (currentTime - otpDetails.timestamp > 5 * 60 * 1000) {
            this.otpMap.delete(phoneNo);
            return false; // OTP expired
        }
        return true;
    }
}

module.exports = OTPService;