import { useState, useEffect, useRef } from "react";
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
import { uploadImage } from "@/lib/api/uploads";
import { ImageIcon, Loader2 } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaKoRef = useRef<HTMLTextAreaElement>(null);
  const textareaEnRef = useRef<HTMLTextAreaElement>(null);
  const { addPost, updatePost } = usePosts();
  const router = useRouter();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      // post.tags는 { id: number, name: { ko: string, en: string } }[] 형태
      // tags state는 { ko: string, en: string }[] 형태여야 함
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

  const handleImageUpload = async (file: File, lang: "ko" | "en") => {
    if (!file.type.startsWith("image/")) {
      alert(t("invalid_file_type"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t("file_too_large"));
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      const markdown = `![${file.name}](${imageUrl})`;

      const textarea =
        lang === "ko" ? textareaKoRef.current : textareaEnRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = content[lang];
        const newContent =
          currentContent.substring(0, start) +
          markdown +
          currentContent.substring(end);

        setContent({ ...content, [lang]: newContent });

        setTimeout(() => {
          textarea.focus();
          const newPosition = start + markdown.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      } else {
        setContent({ ...content, [lang]: content[lang] + "\n" + markdown });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(t("upload_failed"));
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent, lang: "ko" | "en") => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleImageUpload(file, lang);
        }
        break;
      }
    }
  };

  const handleDrop = async (e: React.DragEvent, lang: "ko" | "en") => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type.startsWith("image/")) {
      await handleImageUpload(file, lang);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (lang: "ko" | "en") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImageUpload(file, lang);
      }
    };
    input.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (post) {
      // 수정 모드: 백엔드가 기대하는 형태로 데이터 전송
      const updateData = {
        title,
        content,
        summary: {
          ko: content.ko.substring(0, 100),
          en: content.en.substring(0, 100),
        },
        tags: tags, // { ko: string, en: string }[] 형태
      };

      // updatePost는 전체 Post 객체를 기대하므로 병합
      updatePost({ ...post, ...updateData });
      router.push(`/posts/${post.id}`);
    } else {
      // 생성 모드
      const createData = {
        title,
        content,
        author: "Dandy",
        summary: {
          ko: content.ko.substring(0, 100),
          en: content.en.substring(0, 100),
        },
        tags: tags, // { ko: string, en: string }[] 형태
      };
      addPost(createData);
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileSelect("ko")}
                    disabled={uploading || showPreview.ko}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </Button>
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
                <div
                  onDrop={(e) => handleDrop(e, "ko")}
                  onDragOver={handleDragOver}
                  className="relative"
                >
                  <Textarea
                    ref={textareaKoRef}
                    id="content-ko"
                    value={content.ko}
                    onChange={(e) =>
                      setContent({ ...content, ko: e.target.value })
                    }
                    onPaste={(e) => handlePaste(e, "ko")}
                    rows={15}
                    required={selectedLangs.includes("ko")}
                    className="resize-none"
                  />
                </div>
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileSelect("en")}
                    disabled={uploading || showPreview.en}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </Button>
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
                <div
                  onDrop={(e) => handleDrop(e, "en")}
                  onDragOver={handleDragOver}
                  className="relative"
                >
                  <Textarea
                    ref={textareaEnRef}
                    id="content-en"
                    value={content.en}
                    onChange={(e) =>
                      setContent({ ...content, en: e.target.value })
                    }
                    onPaste={(e) => handlePaste(e, "en")}
                    rows={15}
                    required={selectedLangs.includes("en")}
                    className="resize-none"
                  />
                </div>
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
