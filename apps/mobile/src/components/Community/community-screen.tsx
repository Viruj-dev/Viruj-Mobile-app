import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../AppTabBar";

type IconName = keyof typeof Ionicons.glyphMap;

type TipStory = {
  id: string;
  name: string;
  image: string;
  own?: boolean;
};

type FeedPost = {
  id: string;
  author: string;
  role: string;
  time: string;
  body: string;
  tags: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  avatar: string;
  verified?: boolean;
  editorial?: boolean;
};

const doctorPortraits = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80",
];

const stories: TipStory[] = [
  { id: "tip-1", name: "Dr. Smith", image: doctorPortraits[0] },
  { id: "tip-2", name: "Dr. Anjali", image: doctorPortraits[1] },
  { id: "tip-3", name: "Dr. Vikram", image: doctorPortraits[2] },
  { id: "tip-4", name: "Dr. Sarah", image: doctorPortraits[3] },
  { id: "tip-you", name: "Your Story", image: doctorPortraits[0], own: true },
];

const initialPosts: FeedPost[] = [
  {
    id: "post-neha",
    author: "Dr. Neha Verma",
    role: "Neurologist",
    time: "2h ago",
    body:
      "Understanding migraines isn't just about the pain; it's about identifying triggers. Here are 5 common lifestyle factors that could be causing your headaches.",
    tags: "#NeuroHealth #MigraineRelief",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80",
    likes: 1200,
    comments: 84,
    liked: false,
    saved: false,
    avatar: doctorPortraits[1],
    verified: true,
  },
  {
    id: "editorial",
    author: "Viruj Editorial",
    role: "New Research",
    time: "5 min read",
    body: "The future of AI in early cancer detection.",
    tags: "Dr. Rohan Mehta",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    likes: 0,
    comments: 0,
    liked: false,
    saved: false,
    avatar: "",
    editorial: true,
  },
  {
    id: "post-abhishek",
    author: "Abhishek Negi",
    role: "Health Enthusiast",
    time: "5h ago",
    body:
      "Just finished my morning run! Feeling incredibly energized. Remember, consistency is better than intensity. Who else is hitting their goals today?",
    tags: "#FitnessJourney #MorningRoutine",
    image:
      "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=900&q=80",
    likes: 456,
    comments: 22,
    liked: false,
    saved: false,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

function formatLikes(likes: number) {
  if (likes >= 1000) {
    return `${(likes / 1000).toFixed(likes % 1000 === 0 ? 0 : 1)}k`;
  }

  return String(likes);
}

function TopBar({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <View className="h-[64px] flex-row items-center justify-between border-b border-[#F1F3F5] bg-white px-[18px]">
      <View className="flex-row items-center gap-5">
        <Pressable
          onPress={onMenuPress}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="menu" size={28} color="#005B5A" />
        </Pressable>
        <Text className="text-[22px] font-extrabold tracking-normal text-[#005B5A]">
          Viruj
        </Text>
      </View>

      <View className="flex-row items-center gap-5">
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="search-outline" size={24} color="#005B5A" />
        </Pressable>
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="notifications-outline" size={23} color="#005B5A" />
        </Pressable>
      </View>
    </View>
  );
}

function DailyTips({
  onAddStory,
}: {
  onAddStory: () => void;
}) {
  return (
    <View className="bg-white pb-3 pt-4">
      <View className="mb-4 flex-row items-center justify-between px-[18px]">
        <Text className="text-[16px] font-semibold text-[#111111]">
          Daily Health Tips
        </Text>
        <Pressable>
          <Text className="text-[14px] font-medium text-[#006C69]">
            View All
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={stories}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={item.own ? onAddStory : undefined}
            className="mr-[19px] items-center"
          >
            <View className="h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-[#0C9C9A]">
              <View className="h-[54px] w-[54px] overflow-hidden rounded-full bg-[#E9F7F6]">
                <Image
                  source={{ uri: item.image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {item.own ? (
                  <View className="absolute inset-0 items-center justify-center bg-white/70">
                    <Ionicons name="add" size={28} color="#006C69" />
                  </View>
                ) : null}
              </View>
            </View>
            <Text
              numberOfLines={1}
              className="mt-[6px] w-[70px] text-center text-[11px] font-medium text-[#222222]"
            >
              {item.name}
            </Text>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}



function Composer({
  value,
  onChangeText,
  onPost,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onPost: () => void;
}) {
  return (
    <View className="border-y border-[#EEF0F2] bg-white px-[18px] py-3">
      <View className="flex-row items-center gap-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Share something with the community..."
          placeholderTextColor="#777777"
          className="h-[42px] flex-1 rounded-full bg-[#F6F7F8] px-4 text-[13px] text-[#111111]"
        />
        <Pressable
          onPress={onPost}
          className="h-[42px] w-[42px] items-center justify-center rounded-full bg-[#00827D]"
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function EditorialCard() {
  return (
    <View className="border-y border-[#EEF0F2] bg-[#F7F8F9] px-[18px] py-[24px]">
      <View className="mb-[14px] flex-row items-center justify-between">
        <Text className="text-[16px] font-medium text-[#111111]">
          Viruj Editorial
        </Text>
        <Pressable>
          <Text className="text-[15px] font-medium text-[#006C69]">
            Read Journal
          </Text>
        </Pressable>
      </View>

      <Pressable className="min-h-[102px] flex-row rounded-[9px] border border-[#DDE1E5] bg-[#F7F8F9] p-[14px]">
        <Image
          source={{ uri: initialPosts[1].image }}
          className="h-[72px] w-[72px] rounded-[6px]"
          resizeMode="cover"
        />
        <View className="ml-[14px] min-w-0 flex-1">
          <Text className="text-[9px] font-extrabold uppercase tracking-[1px] text-[#006C69]">
            New Research
          </Text>
          <Text className="mt-[6px] text-[15px] font-medium leading-[19px] text-[#111111]">
            The future of AI in early cancer detection.
          </Text>
          <Text className="mt-[3px] text-[11px] font-medium text-[#6D747A]">
            5 min read - Dr. Rohan Mehta
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

function FeedPostCard({
  post,
  commentText,
  onLike,
  onSave,
  onCommentChange,
  onComment,
}: {
  post: FeedPost;
  commentText: string;
  onLike: () => void;
  onSave: () => void;
  onCommentChange: (value: string) => void;
  onComment: () => void;
}) {
  return (
    <View className="bg-white px-[18px] pb-[16px] pt-[20px]">
      <View className="mb-[14px] flex-row items-center">
        <Image
          source={{ uri: post.avatar }}
          className="h-[39px] w-[39px] rounded-full"
          resizeMode="cover"
        />
        <View className="ml-[11px] min-w-0 flex-1">
          <View className="flex-row items-center">
            <Text className="text-[15px] font-medium text-[#111111]">
              {post.author}
            </Text>
            {post.verified ? (
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color="#007C78"
                style={{ marginLeft: 4 }}
              />
            ) : null}
          </View>
          <Text className="text-[11px] font-medium text-[#5F666D]">
            {post.role} - {post.time}
          </Text>
        </View>

        <Pressable className="h-8 w-8 items-center justify-center">
          <Ionicons name="ellipsis-horizontal" size={22} color="#111111" />
        </Pressable>
      </View>

      <Text className="text-[14px] font-normal leading-[22px] text-[#161616]">
        {post.body}
      </Text>
      <Text className="mt-[2px] text-[14px] font-medium leading-[20px] text-[#006C69]">
        {post.tags}
      </Text>

      <Image
        source={{ uri: post.image }}
        className="mt-[14px] h-[220px] w-full rounded-[8px]"
        resizeMode="cover"
      />

      <View className="mt-[17px] flex-row items-center justify-between">
        <View className="flex-row items-center gap-[22px]">
          <Pressable onPress={onLike} className="flex-row items-center gap-2">
            <Ionicons
              name={post.liked ? "heart" : "heart-outline"}
              size={24}
              color={post.liked ? "#E7415E" : "#111111"}
            />
            <Text className="text-[11px] font-medium text-[#111111]">
              {formatLikes(post.likes)}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center gap-2">
            <Ionicons name="chatbox-outline" size={23} color="#111111" />
            <Text className="text-[11px] font-medium text-[#111111]">
              {post.comments}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center gap-2">
            <Ionicons name="share-social-outline" size={22} color="#111111" />
            <Text className="text-[11px] font-medium text-[#111111]">
              Share
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={onSave}>
          <Ionicons
            name={post.saved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#111111"
          />
        </Pressable>
      </View>

      <View className="mt-[14px] flex-row items-center gap-2">
        <TextInput
          value={commentText}
          onChangeText={onCommentChange}
          placeholder="Add a comment..."
          placeholderTextColor="#777777"
          className="h-[38px] flex-1 rounded-full bg-[#F6F7F8] px-4 text-[12px] text-[#111111]"
        />
        <Pressable
          onPress={onComment}
          className="h-[38px] w-[38px] items-center justify-center rounded-full bg-[#00827D]"
        >
          <Ionicons name="send" size={15} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function makeMorePosts(start: number, count: number): FeedPost[] {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;
    const doctor = number % 2 === 0;

    return {
      id: `generated-${number}`,
      author: doctor ? "Dr. Rohan Mehta" : "Viruj City Hospital",
      role: doctor ? "Oncologist" : "Hospital Update",
      time: `${number + 2}h ago`,
      body: doctor
        ? "Small preventive habits compound over time. Schedule screenings on time and keep your reports organized for every follow-up."
        : "Our evening health desk is open for report reviews and follow-up appointment support today.",
      tags: doctor ? "#PreventiveCare #HealthScreening" : "#HospitalUpdate #VirujCare",
      image: doctor
        ? "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80"
        : "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
      likes: 180 + number * 17,
      comments: 12 + number,
      liked: false,
      saved: false,
      avatar: doctor ? doctorPortraits[2] : doctorPortraits[3],
      verified: doctor,
    };
  });
}

export default function CommunityScreen({
  onTabPress,
}: {
  onTabPress?: (tab: AppTab) => void;
}) {
  const [feed, setFeed] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [storyCount, setStoryCount] = useState(0);
  const [showComposer, setShowComposer] = useState(false);

  const addPost = () => {
    const body = draft.trim();

    if (!body) {
      return;
    }

    setFeed((current) => [
      {
        id: `user-post-${Date.now()}`,
        author: "Abhishek Negi",
        role: "Health Enthusiast",
        time: "Just now",
        body,
        tags: "#VirujCommunity",
        image:
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
        likes: 0,
        comments: 0,
        liked: false,
        saved: false,
        avatar: initialPosts[2].avatar,
      },
      ...current,
    ]);
    setDraft("");
    setShowComposer(false);
  };

  const loadMore = useCallback(() => {
    if (loadingMore) {
      return;
    }

    setLoadingMore(true);
    setTimeout(() => {
      setFeed((current) => [...current, ...makeMorePosts(current.length, 4)]);
      setLoadingMore(false);
    }, 250);
  }, [loadingMore]);

  const renderPost: ListRenderItem<FeedPost> = ({ item, index }) => {
    if (item.editorial) {
      return <EditorialCard />;
    }

    return (
      <>
        <FeedPostCard
          post={item}
          commentText={commentDrafts[item.id] ?? ""}
          onLike={() =>
            setFeed((current) =>
              current.map((post) =>
                post.id === item.id
                  ? {
                      ...post,
                      liked: !post.liked,
                      likes: post.liked ? post.likes - 1 : post.likes + 1,
                    }
                  : post
              )
            )
          }
          onSave={() =>
            setFeed((current) =>
              current.map((post) =>
                post.id === item.id ? { ...post, saved: !post.saved } : post
              )
            )
          }
          onCommentChange={(value) =>
            setCommentDrafts((current) => ({ ...current, [item.id]: value }))
          }
          onComment={() => {
            const comment = (commentDrafts[item.id] ?? "").trim();

            if (!comment) {
              return;
            }

            setFeed((current) =>
              current.map((post) =>
                post.id === item.id
                  ? { ...post, comments: post.comments + 1 }
                  : post
              )
            );
            setCommentDrafts((current) => ({ ...current, [item.id]: "" }));
          }}
        />
        {index === 0 ? <View className="h-[8px] bg-[#F6F7F8]" /> : null}
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar onMenuPress={() => setShowComposer((current) => !current)} />
      <FlatList
        ListHeaderComponent={
          <>
            <DailyTips
              onAddStory={() => {
                setStoryCount((current) => current + 1);
              }}
            />
            {storyCount > 0 ? (
              <View className="bg-white px-[18px] pb-3">
                <Text className="text-[12px] font-medium text-[#006C69]">
                  {storyCount} story added
                </Text>
              </View>
            ) : null}
            {showComposer ? (
              <Composer value={draft} onChangeText={setDraft} onPost={addPost} />
            ) : null}
          </>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="items-center bg-white py-5">
              <ActivityIndicator color="#00827D" />
              <Text className="mt-2 text-[12px] font-medium text-[#666666]">
                Loading more posts...
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 112 }}
        data={feed}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.7}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />

      <AppTabBar activeTab="Community" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}
