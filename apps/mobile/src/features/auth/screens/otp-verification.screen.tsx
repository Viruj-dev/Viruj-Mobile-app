import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  AuthBackButton,
  AuthHeader,
  AuthScreen,
  PrimaryButton,
  StatusNotice,
  ToggleTextButton,
} from "../../../screens/Auth/_components/auth-ui";
import { OtpInput } from "../components/otp-input";
import { useAuth } from "../state/auth.context";
import {
  getDisplayError,
  shouldShowDevelopmentOtp,
} from "../utils/auth-errors";
import { formatCountdown, nextCountdown } from "../utils/countdown";
import { maskPhoneNumber } from "../utils/phone-number";

export function OtpVerificationScreen({
  onEditPhone,
}: {
  onEditPhone: () => void;
}) {
  const { challenge, requestOtp, verifyOtp } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [expiresIn, setExpiresIn] = useState(challenge?.expiresInSeconds ?? 0);
  const [retryAfter, setRetryAfter] = useState(challenge?.retryAfterSeconds ?? 0);

  useEffect(() => {
    setExpiresIn(challenge?.expiresInSeconds ?? 0);
    setRetryAfter(challenge?.retryAfterSeconds ?? 0);
    setCode("");
    setError(undefined);
  }, [challenge?.challengeId, challenge?.expiresInSeconds, challenge?.retryAfterSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn(nextCountdown);
      setRetryAfter(nextCountdown);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!challenge) {
    return (
      <AuthScreen>
        <StatusNotice
          tone="danger"
          message="Request a new OTP to continue."
          action={<ToggleTextButton label="Edit phone number" onPress={onEditPhone} />}
        />
      </AuthScreen>
    );
  }

  const verify = async () => {
    if (code.length !== 6 || isVerifying) {
      return;
    }

    try {
      setError(undefined);
      setIsVerifying(true);
      await verifyOtp(code);
    } catch (err) {
      setError(getDisplayError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async () => {
    if (retryAfter > 0 || isResending) {
      return;
    }

    try {
      setError(undefined);
      setIsResending(true);
      const nextChallenge = await requestOtp(challenge.phoneNumber);
      setExpiresIn(nextChallenge.expiresInSeconds);
      setRetryAfter(nextChallenge.retryAfterSeconds);
    } catch (err) {
      setError(getDisplayError(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthScreen>
      <AuthBackButton label="Edit phone" onPress={onEditPhone} />
      <AuthHeader
        align="left"
        title="Verify OTP"
        subtitle={`Enter the 6-digit code sent to ${maskPhoneNumber(challenge.phoneNumber)}.`}
        icon={<Ionicons name="phone-portrait-outline" size={34} color="#0E9996" />}
      />

      {shouldShowDevelopmentOtp(__DEV__, challenge.developmentOtp) ? (
        <StatusNotice
          tone="success"
          title="Development OTP"
          message={`Use ${challenge.developmentOtp} for local development.`}
        />
      ) : null}

      {error ? <StatusNotice tone="danger" message={error} /> : null}

      <OtpInput value={code} onChange={setCode} disabled={isVerifying} />

      <View className="mb-5 flex-row justify-between">
        <Text className="text-[12px] font-semibold text-[#536682]">
          Expires in {formatCountdown(expiresIn)}
        </Text>
        <Text className="text-[12px] font-semibold text-[#536682]">
          {retryAfter > 0 ? `Resend in ${formatCountdown(retryAfter)}` : "Resend available"}
        </Text>
      </View>

      <PrimaryButton
        label="Verify and continue"
        onPress={verify}
        loading={isVerifying}
        disabled={code.length !== 6 || expiresIn === 0}
      />

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-sm font-semibold text-[#536682]">
          Did not receive it?{" "}
        </Text>
        <ToggleTextButton
          label={isResending ? "Sending..." : "Resend"}
          onPress={resend}
        />
      </View>
    </AuthScreen>
  );
}
