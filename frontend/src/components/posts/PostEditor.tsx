import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { usePosts } from "@/contexts/PostContext";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface PostEditorProps {
  post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState({ ko: "", en: "" });
  const [content, setContent] = useState({ ko: "", en: "" });
  const [tags, setTags] = useState<{ ko: string; en: string }[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState({ ko: "", en: "" });
  const [selectedLangs, setSelectedLangs] = useState(["ko"]);
  const [showPreview, setShowPreview] = useState({ ko: false, en: false });
  const { addPost, updatePost } = usePosts();
  const router = useRouter();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.map((t) => t.name));
    }
  }, [post]);

  const handleLangChange = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      setSelectedLangs(selectedLangs.filter((l) => l !== lang));
    } else {
      setSelectedLangs([...selectedLangs, lang]);
    }
  };

  const handleAddTag = (
    e: React.KeyboardEvent<HTMLInputElement>,
    lang: "ko" | "en"
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTagValue = currentTagInput[lang].trim();
      if (newTagValue) {
        const existingTagIndex = tags.findIndex(
          (tag) => tag[lang] === newTagValue
        );
        if (existingTagIndex === -1) {
          setTags([
            ...tags,
            {
              ko: lang === "ko" ? newTagValue : "",
              en: lang === "en" ? newTagValue : "",
            },
          ]);
        }
      }
      setCurrentTagInput({ ...currentTagInput, [lang]: "" });
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      author: "Dandy",
      summary: {
        ko: content.ko.substring(0, 100),
        en: content.en.substring(0, 100),
      },
      tags: tags,
    };

    if (post) {
      updatePost({ ...post, ...postData });
      router.push(`/posts/${post.id}`);
    } else {
      addPost(postData);
      router.push(`/`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-4 items-center">
        <Label>{t("language")}</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="lang-ko"
            checked={selectedLangs.includes("ko")}
            onCheckedChange={() => handleLangChange("ko")}
          />
          <Label htmlFor="lang-ko">{t("korean")}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="lang-en"
            checked={selectedLangs.includes("en")}
            onCheckedChange={() => handleLangChange("en")}
          />
          <Label htmlFor="lang-en">{t("english")}</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selectedLangs.includes("ko") && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t("korean")}</h3>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title-ko">{t("title")}</Label>
              <Input
                type="text"
                id="title-ko"
                value={title.ko}
                onChange={(e) => setTitle({ ...title, ko: e.target.value })}
                required={selectedLangs.includes("ko")}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="content-ko">
                  {t("content_markdown_supported")}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowPreview({ ...showPreview, ko: !showPreview.ko })
                  }
                >
                  {showPreview.ko ? t("edit") : t("preview")}
                </Button>
              </div>
              {showPreview.ko ? (
                <div className="border rounded-md p-4 min-h-[360px] prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {content.ko}
                  </ReactMarkdown>
                </div>
              ) : (
                <Textarea
                  id="content-ko"
                  value={content.ko}
                  onChange={(e) =>
                    setContent({ ...content, ko: e.target.value })
                  }
                  rows={15}
                  required={selectedLangs.includes("ko")}
                />
              )}
            </div>
          </div>
        )}

        {selectedLangs.includes("en") && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t("english")}</h3>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title-en">{t("title")}</Label>
              <Input
                type="text"
                id="title-en"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
                required={selectedLangs.includes("en")}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="content-en">
                  {t("content_markdown_supported")}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowPreview({ ...showPreview, en: !showPreview.en })
                  }
                >
                  {showPreview.en ? t("edit") : t("preview")}
                </Button>
              </div>
              {showPreview.en ? (
                <div className="border rounded-md p-4 min-h-[360px] prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {content.en}
                  </ReactMarkdown>
                </div>
              ) : (
                <Textarea
                  id="content-en"
                  value={content.en}
                  onChange={(e) =>
                    setContent({ ...content, en: e.target.value })
                  }
                  rows={15}
                  required={selectedLangs.includes("en")}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selectedLangs.includes("ko") && (
          <div className="space-y-2">
            <Label htmlFor="tags-ko">
              {t("tags")} ({t("korean")})
            </Label>
            <Input
              type="text"
              id="tags-ko"
              value={currentTagInput.ko}
              onChange={(e) =>
                setCurrentTagInput({ ...currentTagInput, ko: e.target.value })
              }
              onKeyDown={(e) => handleAddTag(e, "ko")}
              placeholder={t("tags_placeholder")}
            />
          </div>
        )}

        {selectedLangs.includes("en") && (
          <div className="space-y-2">
            <Label htmlFor="tags-en">
              {t("tags")} ({t("english")})
            </Label>
            <Input
              type="text"
              id="tags-en"
              value={currentTagInput.en}
              onChange={(e) =>
                setCurrentTagInput({ ...currentTagInput, en: e.target.value })
              }
              onKeyDown={(e) => handleAddTag(e, "en")}
              placeholder={t("tags_placeholder")}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {selectedLangs.includes("ko") && tag.ko && (
              <span className="text-xs">🇰🇷 {tag.ko}</span>
            )}
            {selectedLangs.includes("en") && tag.en && (
              <span className="text-xs">🇬🇧 {tag.en}</span>
            )}
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="ml-1 text-xs text-gray-500 hover:text-gray-700"
            >
              x
            </button>
          </Badge>
        ))}
      </div>

      <Button type="submit">{t("save")}</Button>
    </form>
  );
}
