import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../../_components/AppTabBar";
import Composer from "./composer";
import {
  FeedPost,
  initialPosts,
  makeMorePosts,
} from "./community-data";
import DailyTips from "./daily-tips";
import EditorialCard from "./editorial-card";
import FeedPostCard from "./feed-post-card";
import TopBar from "./top-bar";

export default function CommunityScreenContent({
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
