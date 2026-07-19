import { useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = isValidIndianMobile(phone);

  const submit = async () => {
    if (!isValid || isSubmitting) {
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
        title="Sign in with phone"
        subtitle="Enter your Indian mobile number and we will send a secure one-time code."
        icon={<Ionicons name="call-outline" size={32} color="#0E9996" />}
      />

      {error ? <StatusNotice tone="danger" message={error} /> : null}

      <Field
        label="Mobile number"
        error={phone && !isValid ? "Enter a valid 10-digit mobile number" : undefined}
        input={<PhoneInput value={phone} onChange={setPhone} error={Boolean(error)} />}
      />

      {phone ? (
        <Text className="mb-3 text-[13px] font-semibold text-[#536682]">
          Sending to +91 {formatIndianMobile(phone)}
        </Text>
      ) : (
        <View className="mb-3" />
      )}

      <PrimaryButton
        label="Request OTP"
        onPress={submit}
        loading={isSubmitting}
        disabled={!isValid}
      />
    </AuthScreen>
  );
}
