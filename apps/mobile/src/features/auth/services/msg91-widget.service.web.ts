const unsupported = (): never => { throw new Error("OTP login requires the Viruj Android or iOS app."); };

export const sendOtp = (_phoneNumber: string) => unsupported();
export const retryOtp = (_requestId: string) => unsupported();
export const verifyOtp = (_requestId: string, _otp: string) => unsupported();
