import { useState } from "react";
import { Text, View } from "react-native";
import {
  AuthHeader,
  AuthScreen,
  Field,
  PrimaryButton,
  StatusNotice,
} from "../../../screens/Auth/_components/auth-ui";
import { PhoneInput } from "../components/phone-input";
import { useAuth } from "../state/auth.context";
import { getDisplayError } from "../utils/auth-errors";
import { formatIndianMobile, isValidIndianMobile } from "../utils/phone-number";

export function PhoneAuthScreen({ onOtpRequested }: { onOtpRequested: () => void }) {
  const { requestOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = isValidIndianMobile(phone);

  const submit = async () => {
    setTouched(true);

    if (!isValid) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setError(undefined);
      setIsSubmitting(true);
      await requestOtp(phone);
      onOtpRequested();
    } catch (err) {
      setError(getDisplayError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to continue your care journey."
      />

      {error ? <StatusNotice tone="danger" message={error} /> : null}

      <Field
        label="Mobile number"
        error={touched && phone && !isValid ? "Enter a valid 10-digit mobile number" : undefined}
        input={
          <PhoneInput
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setError(undefined);
            }}
            error={Boolean(error)}
          />
        }
      />

      {phone ? (
        <Text className="mb-4 text-[13px] font-medium text-[#5F5A55]">
          Sending to +91 {formatIndianMobile(phone)}
        </Text>
      ) : (
        <View className="mb-4" />
      )}

      <PrimaryButton
        label="Continue with OTP"
        onPress={submit}
        loading={isSubmitting}
        disabled={false}
      />
    </AuthScreen>
  );
}