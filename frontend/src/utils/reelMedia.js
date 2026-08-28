const DIRECT_VIDEO_EXTENSION = /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#].*)?$/i;
const INSTAGRAM_REEL =
  /^https?:\/\/(?:www\.)?instagram\.com\/reel\/([^/?#]+)\/?(?:[?#].*)?$/i;
const YOUTUBE_VIDEO = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&#/]+)/i;

export const getReelUrl = (reel) => reel?.url || reel?.videoUrl || "";
export const getInstagramReelId = (url = "") =>
  String(url).trim().match(INSTAGRAM_REEL)?.[1] || null;
export const getYouTubeVideoId = (url = "") => String(url).trim().match(YOUTUBE_VIDEO)?.[1] || null;
export const getMediaType = (url, platform, videoPublicId, sourceType) => {
  const normalizedUrl = String(url || "").trim();
  if (!normalizedUrl) return "unsupported";
  if (platform === "instagram" || getInstagramReelId(normalizedUrl))
    return "instagram";
  if (platform === "youtube" || getYouTubeVideoId(normalizedUrl)) return "youtube";
  return sourceType === 'upload' || videoPublicId || DIRECT_VIDEO_EXTENSION.test(normalizedUrl)
    ? "video"
    : "unsupported";
};
export const isDirectVideoUrl = (url) =>
  DIRECT_VIDEO_EXTENSION.test(String(url || "").trim());
