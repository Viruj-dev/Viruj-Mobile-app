const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function toIndianMobileDigits(value: string): string {
  const digits = digitsOnly(value);

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits.slice(0, 10);
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_RE.test(toIndianMobileDigits(value));
}

export function normalizeIndianPhoneNumber(value: string): string {
  const mobile = toIndianMobileDigits(value);

  if (!INDIAN_MOBILE_RE.test(mobile)) {
    throw new Error("OTP_INVALID_PHONE_NUMBER");
  }

  return `+91${mobile}`;
}

export function formatIndianMobile(value: string): string {
  const mobile = toIndianMobileDigits(value);
  const first = mobile.slice(0, 5);
  const second = mobile.slice(5, 10);

  return second ? `${first} ${second}` : first;
}

export function maskPhoneNumber(value: string): string {
  const mobile = toIndianMobileDigits(value);

  if (mobile.length < 4) {
    return "+91 *****";
  }

  return `+91 ***** ${mobile.slice(-4)}`;
}
