import ReadingHubSkeleton from "@/components/reading/ReadingHubSkeleton";

/**
 * Next.js streams this fallback while the reading hub fetches the catalogue.
 */
export default function Loading() {
  return <ReadingHubSkeleton />;
}
