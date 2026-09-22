import { useCallback, useEffect, useState } from "react";
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
  mapBackendPostToFeedPost,
} from "./community-data";
import DailyTips from "./daily-tips";
import EditorialCard from "./editorial-card";
import FeedPostCard from "./feed-post-card";
import TopBar from "./top-bar";
import { useResource } from "../../../product/ui";
import { api } from "../../../product/api";

export default function CommunityScreenContent({
  onTabPress,
}: {
  onTabPress?: (tab: AppTab) => void;
}) {
  const [page, setPage] = useState(1);
  const backendFeed = useResource<{ data: any[] }>(`/community/feed?page=${page}&limit=20`);
  const [feed, setFeed] = useState<FeedPost[]>(initialPosts);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [storyCount, setStoryCount] = useState(0);
  const [showComposer, setShowComposer] = useState(false);
  const [posting, setPosting] = useState(false);

  // Sync feed with backend data when loaded
  useEffect(() => {
    if (backendFeed.data?.data && Array.isArray(backendFeed.data.data)) {
      if (backendFeed.data.data.length > 0) {
        const mapped = backendFeed.data.data.map(mapBackendPostToFeedPost);
        // Include editorial card after first post if needed
        if (mapped.length > 1) {
          const editorial = initialPosts.find((p) => p.editorial);
          if (editorial && !mapped.some((p) => p.editorial)) {
            mapped.splice(1, 0, editorial);
          }
        }
        setFeed(mapped);
      }
    }
  }, [backendFeed.data]);

  const addPost = async () => {
    const body = draft.trim();
    if (!body || posting) {
      return;
    }

    setPosting(true);
    try {
      await api.request("/community/posts", {
        method: "POST",
        body: { content: body, type: "update" },
      });
      backendFeed.reload();
    } catch {
      // Fallback local update if offline/guest
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
    } finally {
      setPosting(false);
      setDraft("");
      setShowComposer(false);
    }
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

  const handleLike = async (item: FeedPost) => {
    // Optimistic UI update
    setFeed((current) =>
      current.map((post) =>
        post.id === item.id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
            }
          : post
      )
    );

    try {
      await api.request(`/community/posts/${item.id}/engagement`, {
        method: "POST",
        body: { action: "like" },
      });
    } catch {
      // silent catch for demo/offline resilience
    }
  };

  const handleSave = async (item: FeedPost) => {
    // Optimistic UI update
    setFeed((current) =>
      current.map((post) =>
        post.id === item.id ? { ...post, saved: !post.saved } : post
      )
    );

    try {
      await api.request(`/community/posts/${item.id}/engagement`, {
        method: "POST",
        body: { action: "bookmark" },
      });
    } catch {
      // silent catch
    }
  };

  const handleComment = async (item: FeedPost) => {
    const comment = (commentDrafts[item.id] ?? "").trim();
    if (!comment) {
      return;
    }

    // Optimistic UI update
    setFeed((current) =>
      current.map((post) =>
        post.id === item.id
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
    setCommentDrafts((current) => ({ ...current, [item.id]: "" }));

    try {
      await api.request(`/community/posts/${item.id}/engagement`, {
        method: "POST",
        body: { action: "comment", content: comment },
      });
    } catch {
      // silent catch
    }
  };

  const renderPost: ListRenderItem<FeedPost> = ({ item, index }) => {
    if (item.editorial) {
      return <EditorialCard />;
    }

    return (
      <>
        <FeedPostCard
          post={item}
          commentText={commentDrafts[item.id] ?? ""}
          onLike={() => void handleLike(item)}
          onSave={() => void handleSave(item)}
          onCommentChange={(value) =>
            setCommentDrafts((current) => ({ ...current, [item.id]: value }))
          }
          onComment={() => void handleComment(item)}
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
          loadingMore || backendFeed.loading ? (
            <View className="items-center bg-white py-5">
              <ActivityIndicator color="#00827D" />
              <Text className="mt-2 text-[12px] font-medium text-[#666666]">
                {backendFeed.loading && feed.length === 0
                  ? "Loading community posts..."
                  : "Loading more posts..."}
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

