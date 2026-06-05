import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { FeedPost, formatLikes } from "./community-data";

export default function FeedPostCard({
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
