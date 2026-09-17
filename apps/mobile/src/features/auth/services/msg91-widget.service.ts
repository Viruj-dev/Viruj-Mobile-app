type Widget = {
  initializeWidget(widgetId: string, tokenAuth: string): Promise<void>;
  sendOTP(body: { identifier: string }): Promise<unknown>;
  retryOTP(body: { reqId: string }): Promise<unknown>;
  verifyOTP(body: { reqId: string; otp: string }): Promise<unknown>;
};

type Response = { type?: string; message?: string; "access-token"?: string };

let initialized = false;
let sdk: Widget | undefined;

async function widget() {
  if (typeof document !== "undefined") throw new Error("OTP login requires the Viruj Android or iOS app.");
  sdk ??= (require("@msg91comm/sendotp-react-native") as { OTPWidget: Widget }).OTPWidget;
  if (!initialized) {
    const id = process.env.EXPO_PUBLIC_MSG91_WIDGET_ID?.trim();
    const token = process.env.EXPO_PUBLIC_MSG91_WIDGET_TOKEN?.trim();
    if (!id || !token) throw new Error("MSG91 widget is not configured.");
    await sdk.initializeWidget(id, token);
    initialized = true;
  }
  return sdk;
}

function success(response: Response | undefined, value: "message" | "access-token") {
  const result = response?.[value];
  if (response?.type !== "success" || !result) throw new Error(response?.message || "MSG91 rejected the request.");
  return result;
}

export async function sendOtp(phoneNumber: string) {
  const response = await (await widget()).sendOTP({ identifier: phoneNumber.replace("+", "") }) as Response;
  return { requestId: success(response, "message"), accessToken: response["access-token"] };
}

export async function retryOtp(requestId: string) {
  const response = await (await widget()).retryOTP({ reqId: requestId }) as Response;
  return success(response, "message");
}

export async function verifyOtp(requestId: string, otp: string) {
  const response = await (await widget()).verifyOTP({ reqId: requestId, otp }) as Response;
  return success(response, "access-token");
}
