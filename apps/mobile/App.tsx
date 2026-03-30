import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';

type Screen =
  | 'home'
  | 'my-health'
  | 'ai'
  | 'community'
  | 'profile'
  | 'notifications'
  | 'doctors'
  | 'hospitals';

type Concern = {
  id: string;
  title: string;
  tint: string;
  badge: string;
};

type Service = {
  id: string;
  title: string;
  subtitle: string;
  active: boolean;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  hospital: string;
  experience: string;
  fee: string;
  rating: string;
  initials: string;
  accent: string;
};

type Hospital = {
  id: string;
  name: string;
  departments: string;
  location: string;
  rating: string;
  badges: string[];
  accent: string;
};

type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  status: 'Live' | 'Pending' | 'Completed' | 'Cancelled';
};

type Post = {
  id: string;
  author: string;
  role: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
};

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

const concerns: Concern[] = [
  { id: 'surgery', title: 'Surgery', tint: '#fee2e2', badge: 'SR' },
  { id: 'cardiac', title: 'Cardiac', tint: '#ffe4e6', badge: 'CA' },
  { id: 'neuro', title: 'Neuro', tint: '#fce7f3', badge: 'NE' },
  { id: 'ortho', title: 'Orthopaedics', tint: '#ffedd5', badge: 'OR' },
  { id: 'medicine', title: 'Medicine', tint: '#dbeafe', badge: 'MD' },
  { id: 'women', title: 'Women Care', tint: '#ede9fe', badge: 'WC' },
  { id: 'oncology', title: 'Oncology', tint: '#fed7aa', badge: 'ON' },
  { id: 'diagnostics', title: 'Diagnostics', tint: '#ccfbf1', badge: 'DX' },
];

const services: Service[] = [
  { id: 'doctors', title: 'Doctors', subtitle: 'Top specialists', active: true },
  { id: 'hospitals', title: 'Hospitals', subtitle: 'Nearby facilities', active: true },
  { id: 'pathlabs', title: 'Pathlabs', subtitle: 'Reports and tests', active: true },
  { id: 'clinics', title: 'Clinics', subtitle: 'Coming soon', active: false },
];

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aditi Mehra',
    specialty: 'Cardiac Sciences',
    qualification: 'MD, DM Cardiology',
    hospital: 'Viruj Heart Center',
    experience: '12 yrs',
    fee: 'Rs 900',
    rating: '4.9',
    initials: 'AM',
    accent: '#dbeafe',
  },
  {
    id: '2',
    name: 'Dr. Rohan Singh',
    specialty: 'Neurosciences',
    qualification: 'MS, MCh Neurosurgery',
    hospital: 'Viruj Neuro Institute',
    experience: '10 yrs',
    fee: 'Rs 1200',
    rating: '4.8',
    initials: 'RS',
    accent: '#fce7f3',
  },
  {
    id: '3',
    name: 'Dr. Kavya Nair',
    specialty: 'Internal Medicine',
    qualification: 'MD Physician',
    hospital: 'Viruj City Hospital',
    experience: '8 yrs',
    fee: 'Rs 700',
    rating: '4.7',
    initials: 'KN',
    accent: '#dcfce7',
  },
  {
    id: '4',
    name: 'Dr. Arjun Rao',
    specialty: 'Orthopaedics',
    qualification: 'MS Ortho',
    hospital: 'Viruj Bone and Joint',
    experience: '15 yrs',
    fee: 'Rs 1100',
    rating: '4.9',
    initials: 'AR',
    accent: '#ffedd5',
  },
];

const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'Viruj Multispeciality',
    departments: 'Cardiac, Neuro, Oncology, ICU',
    location: 'Bhopal, Madhya Pradesh',
    rating: '4.8',
    badges: ['Emergency', 'Ambulance', 'Parking'],
    accent: '#fee2e2',
  },
  {
    id: '2',
    name: 'Viruj Women and Child',
    departments: 'Gynaecology, Neonatal, Paediatrics',
    location: 'Indore, Madhya Pradesh',
    rating: '4.7',
    badges: ['NICU', 'Emergency'],
    accent: '#ede9fe',
  },
  {
    id: '3',
    name: 'Viruj Diagnostics Hub',
    departments: 'Radiology, Pathology, Imaging',
    location: 'Jabalpur, Madhya Pradesh',
    rating: '4.6',
    badges: ['CT', 'MRI', 'Reports'],
    accent: '#ccfbf1',
  },
];

const activeAppointments: Appointment[] = [
  {
    id: 'a1',
    doctor: 'Dr. Aditi Mehra',
    specialty: 'Cardiac Sciences',
    hospital: 'Viruj Heart Center',
    date: '02 Apr 2026',
    time: '11:30 AM',
    status: 'Live',
  },
  {
    id: 'a2',
    doctor: 'Dr. Kavya Nair',
    specialty: 'Internal Medicine',
    hospital: 'Viruj City Hospital',
    date: '04 Apr 2026',
    time: '05:00 PM',
    status: 'Pending',
  },
];

const pastAppointments: Appointment[] = [
  {
    id: 'p1',
    doctor: 'Dr. Arjun Rao',
    specialty: 'Orthopaedics',
    hospital: 'Viruj Bone and Joint',
    date: '23 Mar 2026',
    time: '03:00 PM',
    status: 'Completed',
  },
  {
    id: 'p2',
    doctor: 'Dr. Rohan Singh',
    specialty: 'Neurosciences',
    hospital: 'Viruj Neuro Institute',
    date: '18 Mar 2026',
    time: '01:30 PM',
    status: 'Cancelled',
  },
];

const posts: Post[] = [
  {
    id: 'post-1',
    author: 'Nisha Verma',
    role: 'Patient',
    time: '2h ago',
    content:
      'Booked my mother for a cardiac follow-up through Viruj. The appointment flow is fast and the hospital updates are very clear.',
    likes: 34,
    comments: 9,
  },
  {
    id: 'post-2',
    author: 'Dr. Aman Kapoor',
    role: 'Doctor',
    time: '5h ago',
    content:
      'Daily reminder: track blood pressure readings consistently and bring them to consultation. Pattern matters more than a single number.',
    likes: 51,
    comments: 13,
  },
];

const notifications = [
  'Appointment approved for Dr. Aditi Mehra at 11:30 AM.',
  'Your pathology report is ready to view.',
  'Viruj AI summary has been saved to My Health.',
];

const initialChat: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'ai',
    text: 'Hello, I am Viruj AI. Ask about symptoms, tests, follow-up, or hospital guidance.',
  },
];

function AppShell() {
  const [screen, setScreen] = useState<Screen>('home');
  const [search, setSearch] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    const doctorMatches = doctors
      .filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query),
      )
      .map((doctor) => ({
        id: doctor.id,
        title: doctor.name,
        subtitle: doctor.specialty,
        type: 'Doctor',
        target: 'doctors' as Screen,
      }));

    const hospitalMatches = hospitals
      .filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.departments.toLowerCase().includes(query),
      )
      .map((hospital) => ({
        id: hospital.id,
        title: hospital.name,
        subtitle: hospital.location,
        type: 'Hospital',
        target: 'hospitals' as Screen,
      }));

    return [...doctorMatches, ...hospitalMatches];
  }, [search]);

  const sendChat = () => {
    const prompt = chatInput.trim();
    if (!prompt) return;

    const nextUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
    };

    const nextAiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text:
        'This is a UI prototype response from Viruj AI. The final app can connect this screen to your backend chat and report generation APIs.',
    };

    setMessages((current) => [...current, nextUserMessage, nextAiMessage]);
    setChatInput('');
  };

  const renderHeader = (title?: string, showSearch?: boolean) => (
    <View className="rounded-b-[32px] bg-[#4f0f12] px-5 pb-6 pt-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-[28px] font-black tracking-tight text-white">
            {title ?? 'Welcome Back'}
          </Text>
          <Text className="mt-1 text-sm text-white/75">Dhruv</Text>
          <Text className="mt-1 text-xs uppercase tracking-[2px] text-white/50">
            Viruj Health Companion
          </Text>
        </View>

        <Pressable
          onPress={() => setScreen('notifications')}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15"
        >
          <Text className="text-lg font-bold text-white">3</Text>
        </Pressable>
      </View>

      {showSearch ? (
        <View className="mt-5 rounded-full bg-white px-4 py-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search doctors, hospitals, departments..."
            placeholderTextColor="#94a3b8"
            className="text-[15px] text-slate-900"
          />
        </View>
      ) : null}
    </View>
  );

  const renderHome = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader(undefined, true)}

      {searchResults.length > 0 ? (
        <View className="mx-4 mt-4 rounded-[28px] bg-white p-4 shadow-sm">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
            Search Results
          </Text>
          {searchResults.map((result) => (
            <Pressable
              key={`${result.type}-${result.id}`}
              onPress={() => {
                setScreen(result.target);
                setSearch('');
              }}
              className="mt-3 rounded-2xl border border-slate-100 px-4 py-3"
            >
              <Text className="text-base font-bold text-slate-900">
                {result.title}
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                {result.type} | {result.subtitle}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View className="px-4 pt-4">
        <Text className="self-start rounded-full bg-[#fef2f2] px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
          Select Your Health Concern
        </Text>
        <View className="mt-4 flex-row flex-wrap justify-between">
          {concerns.map((concern) => (
            <Pressable
              key={concern.id}
              className="mb-3 w-[48%] rounded-[24px] p-4"
              style={{ backgroundColor: concern.tint }}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-white/80">
                <Text className="text-sm font-black text-[#7f1d1d]">
                  {concern.badge}
                </Text>
              </View>
              <Text className="mt-4 text-sm font-bold text-slate-900">
                {concern.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-2 px-4">
        <Text className="self-start rounded-full bg-[#fef2f2] px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
          Healthcare Services
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {services.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => {
                if (service.id === 'doctors') setScreen('doctors');
                if (service.id === 'hospitals') setScreen('hospitals');
              }}
              className={`mr-4 w-36 rounded-[28px] border px-4 py-5 ${
                service.active
                  ? 'border-slate-100 bg-white'
                  : 'border-slate-200 bg-slate-100'
              }`}
            >
              <View
                className={`h-16 w-16 items-center justify-center rounded-[22px] ${
                  service.active ? 'bg-[#fef2f2]' : 'bg-slate-200'
                }`}
              >
                <Text className="text-lg font-black text-[#7f1d1d]">
                  {service.title.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text className="mt-4 text-base font-bold text-slate-900">
                {service.title}
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                {service.subtitle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="mt-4 px-4">
        <View className="rounded-[30px] bg-[#7f1d1d] p-5">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-white/60">
            Hospital Banner
          </Text>
          <Text className="mt-2 text-2xl font-black text-white">
            Trusted care, faster booking.
          </Text>
          <Text className="mt-2 max-w-[240px] text-sm leading-6 text-white/75">
            Mirror of the VirujHealth home promo block with premium red hero styling.
          </Text>
          <Pressable
            onPress={() => setScreen('hospitals')}
            className="mt-5 self-start rounded-full bg-white px-4 py-3"
          >
            <Text className="text-xs font-bold uppercase tracking-[2px] text-[#7f1d1d]">
              Explore Hospitals
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="mt-6 px-4">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-2xl font-black text-slate-900">
              Top Doctors
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Consult with our best specialists
            </Text>
          </View>
          <Pressable onPress={() => setScreen('doctors')}>
            <Text className="text-sm font-bold text-[#b91c1c]">View all</Text>
          </Pressable>
        </View>

        {doctors.map((doctor) => (
          <View key={doctor.id} className="mt-4 rounded-[28px] bg-white p-4 shadow-sm">
            <View className="flex-row">
              <View
                className="h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: doctor.accent }}
              >
                <Text className="text-xl font-black text-[#7f1d1d]">
                  {doctor.initials}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-black text-slate-900">
                  {doctor.name}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-[#2563eb]">
                  {doctor.specialty}
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  {doctor.qualification}
                </Text>
                <View className="mt-3 flex-row flex-wrap">
                  <Text className="mr-2 mb-2 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#166534]">
                    {doctor.hospital}
                  </Text>
                  <Text className="mr-2 mb-2 rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-semibold text-[#7e22ce]">
                    {doctor.experience}
                  </Text>
                  <Text className="mr-2 mb-2 rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#b91c1c]">
                    {doctor.fee}
                  </Text>
                </View>
                <Text className="text-xs text-slate-500">
                  Rating {doctor.rating} / 5
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-6 px-4">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-2xl font-black text-slate-900">
              Nearby Hospitals
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Quality healthcare facilities near you
            </Text>
          </View>
          <Pressable onPress={() => setScreen('hospitals')}>
            <Text className="text-sm font-bold text-[#b91c1c]">View all</Text>
          </Pressable>
        </View>

        {hospitals.map((hospital) => (
          <View key={hospital.id} className="mt-4 rounded-[28px] bg-white p-4 shadow-sm">
            <View className="flex-row">
              <View
                className="h-24 w-24 items-center justify-center rounded-[22px]"
                style={{ backgroundColor: hospital.accent }}
              >
                <Text className="text-xl font-black text-[#7f1d1d]">H</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-black text-slate-900">
                  {hospital.name}
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  {hospital.departments}
                </Text>
                <Text className="mt-2 text-xs text-slate-500">
                  {hospital.location}
                </Text>
                <Text className="mt-2 text-sm font-bold text-[#ca8a04]">
                  Rating {hospital.rating}
                </Text>
                <View className="mt-2 flex-row flex-wrap">
                  {hospital.badges.map((badge) => (
                    <Text
                      key={badge}
                      className="mr-2 mb-2 rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#b91c1c]"
                    >
                      {badge}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderDoctorList = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader('Top Doctors', false)}
      <View className="px-4 pt-4">
        {doctors.map((doctor) => (
          <View key={doctor.id} className="mb-4 rounded-[28px] bg-white p-4 shadow-sm">
            <View className="flex-row items-center">
              <View
                className="h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: doctor.accent }}
              >
                <Text className="text-xl font-black text-[#7f1d1d]">
                  {doctor.initials}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-black text-slate-900">
                  {doctor.name}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-[#2563eb]">
                  {doctor.specialty}
                </Text>
                <Text className="mt-2 text-xs text-slate-500">
                  {doctor.qualification}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row flex-wrap">
              <Text className="mr-2 mb-2 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#166534]">
                {doctor.hospital}
              </Text>
              <Text className="mr-2 mb-2 rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-semibold text-[#7e22ce]">
                {doctor.experience}
              </Text>
              <Text className="mr-2 mb-2 rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#b91c1c]">
                {doctor.fee}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderHospitalList = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader('Nearby Hospitals', false)}
      <View className="px-4 pt-4">
        {hospitals.map((hospital) => (
          <View key={hospital.id} className="mb-4 rounded-[28px] bg-white p-4 shadow-sm">
            <View className="flex-row">
              <View
                className="h-24 w-24 items-center justify-center rounded-[24px]"
                style={{ backgroundColor: hospital.accent }}
              >
                <Text className="text-xl font-black text-[#7f1d1d]">VH</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-black text-slate-900">
                  {hospital.name}
                </Text>
                <Text className="mt-1 text-xs leading-5 text-slate-500">
                  {hospital.departments}
                </Text>
                <Text className="mt-2 text-xs text-slate-500">
                  {hospital.location}
                </Text>
                <Text className="mt-2 text-sm font-bold text-[#ca8a04]">
                  Rating {hospital.rating}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row flex-wrap">
              {hospital.badges.map((badge) => (
                <Text
                  key={badge}
                  className="mr-2 mb-2 rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#b91c1c]"
                >
                  {badge}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMyHealth = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader('My Health', false)}
      <View className="px-4 pt-4">
        <View className="flex-row justify-between">
          <View className="w-[48%] rounded-[26px] bg-white p-4 shadow-sm">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
              Health Profile
            </Text>
            <Text className="mt-4 text-lg font-black text-slate-900">
              Vitals synced
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Track allergies, medications and recent test summaries.
            </Text>
          </View>
          <View className="w-[48%] rounded-[26px] bg-white p-4 shadow-sm">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
              Quick Rebook
            </Text>
            <Text className="mt-4 text-lg font-black text-slate-900">
              Fast follow-up
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Jump back into care with one tap from appointment history.
            </Text>
          </View>
        </View>

        <Text className="mt-8 text-2xl font-black text-slate-900">
          Current Appointments
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          Live requests and upcoming consultations.
        </Text>

        {activeAppointments.map((appointment) => (
          <View key={appointment.id} className="mt-4 rounded-[28px] bg-white p-4 shadow-sm">
            <View className="h-1 rounded-full bg-[#b91c1c]" />
            <Text className="mt-4 text-lg font-black text-slate-900">
              {appointment.hospital}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              {appointment.doctor} | {appointment.specialty}
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              {appointment.date} | {appointment.time}
            </Text>
            <Text className="mt-3 self-start rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
              {appointment.status}
            </Text>
          </View>
        ))}

        <Text className="mt-8 text-2xl font-black text-slate-900">
          Past Appointments
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          Consultation history and rebooking shortcuts.
        </Text>

        {pastAppointments.map((appointment) => (
          <View key={appointment.id} className="mt-4 rounded-[28px] bg-white p-4 shadow-sm">
            <Text className="text-lg font-black text-slate-900">
              {appointment.hospital}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              {appointment.doctor} | {appointment.specialty}
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              {appointment.date} | {appointment.time}
            </Text>
            <Text className="mt-3 self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[2px] text-slate-600">
              {appointment.status}
            </Text>
          </View>
        ))}

        <Pressable className="absolute bottom-4 right-4 rounded-full bg-[#7f1d1d] px-5 py-4">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-white">
            Upload
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderCommunity = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader('Community', false)}
      <View className="px-4 pt-4">
        <View className="rounded-[28px] border border-dashed border-[#fecaca] bg-[#fff1f2] p-4">
          <Text className="text-sm font-bold text-slate-900">
            What&apos;s on your mind, Dhruv?
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Share patient experiences, ask for care tips, or post a recovery update.
          </Text>
          <Pressable className="mt-4 self-start rounded-full bg-[#b91c1c] px-4 py-3">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-white">
              Create Post
            </Text>
          </Pressable>
        </View>

        <View className="mt-6 flex-row">
          <View className="mr-3 rounded-full bg-white px-4 py-3 shadow-sm">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
              Latest
            </Text>
          </View>
          <View className="mr-3 rounded-full bg-white px-4 py-3 shadow-sm">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-slate-500">
              Doctors
            </Text>
          </View>
          <View className="rounded-full bg-white px-4 py-3 shadow-sm">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-slate-500">
              Patients
            </Text>
          </View>
        </View>

        {posts.map((post) => (
          <View key={post.id} className="mt-4 rounded-[28px] bg-white p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2]">
                <Text className="text-base font-black text-[#b91c1c]">
                  {post.author
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-base font-black text-slate-900">
                  {post.author}
                </Text>
                <Text className="text-xs text-slate-500">
                  {post.role} | {post.time}
                </Text>
              </View>
            </View>
            <Text className="mt-4 text-sm leading-7 text-slate-700">
              {post.content}
            </Text>
            <View className="mt-4 flex-row">
              <Text className="mr-3 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                {post.likes} likes
              </Text>
              <Text className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                {post.comments} comments
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAi = () => (
    <View className="flex-1">
      {renderHeader('AI Assistant', false)}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-[28px] bg-[#fff7ed] p-4">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-[#b91c1c]">
            Suggested Prompts
          </Text>
          <Text className="mt-3 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            Summarize my symptoms before a consultation
          </Text>
          <Text className="mt-3 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            What tests are usually suggested for chest pain?
          </Text>
        </View>

        {messages.map((message) => (
          <View
            key={message.id}
            className={`mt-4 max-w-[90%] rounded-[26px] px-4 py-3 ${
              message.sender === 'user'
                ? 'self-end bg-[#7f1d1d]'
                : 'self-start bg-white'
            }`}
          >
            <Text
              className={`text-sm leading-6 ${
                message.sender === 'user' ? 'text-white' : 'text-slate-700'
              }`}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-24 left-4 right-4 rounded-[28px] bg-white px-4 py-3 shadow-lg">
        <View className="flex-row items-center">
          <TextInput
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Ask Viruj AI about symptoms or follow-up..."
            placeholderTextColor="#94a3b8"
            className="flex-1 text-[15px] text-slate-900"
          />
          <Pressable
            onPress={sendChat}
            className="ml-3 rounded-full bg-[#b91c1c] px-4 py-3"
          >
            <Text className="text-xs font-bold uppercase tracking-[2px] text-white">
              Send
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderProfile = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader('Profile', false)}
      <View className="items-center px-4 pt-6">
        <Image
          source={require('./assets/icon.png')}
          className="h-28 w-28 rounded-full"
          resizeMode="cover"
        />
        <Text className="mt-4 text-2xl font-black text-slate-900">
          Dhruv Sharma
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          dhruv@virujhealth.app
        </Text>
      </View>

      <View className="px-4 pt-6">
        {[
          'Edit profile',
          'Medical records',
          'Privacy policy',
          'Saved doctors',
          'Support and feedback',
        ].map((item) => (
          <View key={item} className="mb-3 rounded-[24px] bg-white px-5 py-4 shadow-sm">
            <Text className="text-base font-bold text-slate-900">{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderNotifications = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader('Notifications', false)}
      <View className="px-4 pt-4">
        {notifications.map((item) => (
          <View key={item} className="mb-4 rounded-[24px] bg-white p-4 shadow-sm">
            <Text className="text-sm leading-6 text-slate-700">{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderScreen = () => {
    if (screen === 'home') return renderHome();
    if (screen === 'my-health') return renderMyHealth();
    if (screen === 'ai') return renderAi();
    if (screen === 'community') return renderCommunity();
    if (screen === 'profile') return renderProfile();
    if (screen === 'notifications') return renderNotifications();
    if (screen === 'doctors') return renderDoctorList();
    return renderHospitalList();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <StatusBar style="light" />
      {renderScreen()}

      <View className="absolute bottom-4 left-4 right-4 flex-row items-end justify-between rounded-[28px] bg-white/95 px-4 py-3 shadow-lg">
        <Pressable onPress={() => setScreen('home')} className="items-center">
          <Text
            className={`text-xs font-bold ${screen === 'home' ? 'text-[#b91c1c]' : 'text-slate-500'}`}
          >
            Home
          </Text>
        </Pressable>
        <Pressable onPress={() => setScreen('my-health')} className="items-center">
          <Text
            className={`text-xs font-bold ${screen === 'my-health' ? 'text-[#b91c1c]' : 'text-slate-500'}`}
          >
            My Health
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setScreen('ai')}
          className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-[#b91c1c]"
        >
          <Text className="text-sm font-black text-white">AI</Text>
        </Pressable>
        <Pressable onPress={() => setScreen('community')} className="items-center">
          <Text
            className={`text-xs font-bold ${screen === 'community' ? 'text-[#b91c1c]' : 'text-slate-500'}`}
          >
            Community
          </Text>
        </Pressable>
        <Pressable onPress={() => setScreen('profile')} className="items-center">
          <Text
            className={`text-xs font-bold ${screen === 'profile' ? 'text-[#b91c1c]' : 'text-slate-500'}`}
          >
            Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}
