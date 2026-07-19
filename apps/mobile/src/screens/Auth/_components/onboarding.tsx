import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  AuthBackButton,
  AuthInput,
  AuthScreen,
  Field,
  PrimaryButton,
  SecondaryButton,
  StatusNotice,
  ToggleTextButton,
} from "./auth-ui";

type Props = {
  onComplete: () => void;
};

type Step = "about" | "health";

type PillProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  className?: string;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function StepHeader({ step }: { step: 1 | 2 }) {
  return (
    <View className="mb-8 items-center">
      <Text className="mb-4 text-[14px] font-medium text-[#5F5A55]">Step {step} of 3</Text>
      <View className="flex-row items-center gap-3">
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className={`h-[5px] w-[72px] rounded-full ${
              item <= step ? "bg-[#18A66B]" : "bg-[#E1DBD3]"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

function Pill({ label, active, onPress, className }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[52px] items-center justify-center rounded-[16px] border px-4 ${
        active ? "border-[#18A66B] bg-[#F0FBF5]" : "border-[#DCD6CE] bg-white"
      } ${className || ""}`}
    >
      <Text className={`text-[14px] font-semibold ${active ? "text-[#111111]" : "text-[#2F2B27]"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function AboutStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [name, setName] = useState("Ananya Sharma");
  const [dob, setDob] = useState("12 August 1998");
  const [gender, setGender] = useState("Female");

  return (
    <AuthScreen>
      <AuthBackButton label="Back" onPress={onSkip} />
      <StepHeader step={1} />

      <View className="mb-7 items-center">
        <Text className="mb-2 text-center text-[28px] font-semibold leading-[34px] text-[#111111]">
          Tell us about yourself
        </Text>
        <Text className="px-6 text-center text-[14px] font-medium leading-6 text-[#5F5A55]">
          A few details help us personalize your Viruj experience.
        </Text>
      </View>

      <Field
        label="Full name"
        input={<AuthInput value={name} onChangeText={setName} placeholder="Full name" />}
      />
      <Field
        label="Date of birth"
        input={
          <AuthInput
            value={dob}
            onChangeText={setDob}
            placeholder="Date of birth"
            right={<Ionicons name="calendar-outline" size={19} color="#5F5A55" />}
          />
        }
      />

      <View className="mb-8">
        <Text className="mb-2 text-[13px] font-semibold text-[#5F5A55]">Gender</Text>
        <View className="flex-row gap-3">
          {["Female", "Male", "Other"].map((item) => (
            <Pill
              key={item}
              label={item}
              active={gender === item}
              onPress={() => setGender(item)}
              className="flex-1"
            />
          ))}
        </View>
      </View>

      <PrimaryButton label="Continue" onPress={onNext} disabled={!name.trim()} />
      <View className="mt-6 items-center">
        <ToggleTextButton label="Skip for now" onPress={onSkip} />
      </View>
    </AuthScreen>
  );
}

function HealthStep({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [height, setHeight] = useState("165 cm");
  const [weight, setWeight] = useState("60 kg");

  return (
    <AuthScreen>
      <AuthBackButton label="Back" onPress={onBack} />
      <StepHeader step={2} />

      <View className="mb-7 items-center">
        <Text className="mb-2 text-center text-[28px] font-semibold leading-[34px] text-[#111111]">
          Your health profile
        </Text>
        <Text className="px-6 text-center text-[14px] font-medium leading-6 text-[#5F5A55]">
          This information helps us provide safer, more relevant care.
        </Text>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-[13px] font-semibold text-[#5F5A55]">Blood group</Text>
        <View className="flex-row flex-wrap gap-3">
          {bloodGroups.map((group) => (
            <Pill
              key={group}
              label={group}
              active={bloodGroup === group}
              onPress={() => setBloodGroup(group)}
              className="w-[22%]"
            />
          ))}
        </View>
      </View>

      <View className="mb-5 flex-row gap-4">
        <View className="flex-1">
          <Field
            label="Height"
            input={<AuthInput value={height} onChangeText={setHeight} placeholder="Height" />}
          />
        </View>
        <View className="flex-1">
          <Field
            label="Weight"
            input={<AuthInput value={weight} onChangeText={setWeight} placeholder="Weight" />}
          />
        </View>
      </View>

      <Field
        label="Allergies & conditions"
        input={
          <AuthInput
            value="None added"
            editable={false}
            right={<Ionicons name="chevron-forward" size={20} color="#111111" />}
          />
        }
      />

      <StatusNotice
        tone="success"
        message="Your health data is private and encrypted end-to-end."
        action={<Ionicons name="lock-closed-outline" size={20} color="#0E754A" />}
      />

      <PrimaryButton label="Save & continue" onPress={onComplete} />
      <View className="mt-4">
        <SecondaryButton label="Back" onPress={onBack} />
      </View>
    </AuthScreen>
  );
}

export default function OnboardingCarousel({ onComplete }: Props) {
  const [step, setStep] = useState<Step>("about");

  if (step === "health") {
    return <HealthStep onBack={() => setStep("about")} onComplete={onComplete} />;
  }

  return <AboutStep onNext={() => setStep("health")} onSkip={onComplete} />;
}