import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePosts } from '@/contexts/PostContext';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface PostEditorProps {
  post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState({ ko: '', en: '' });
  const [content, setContent] = useState({ ko: '', en: '' });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [selectedLangs, setSelectedLangs] = useState(['ko']);
  const { addPost, updatePost } = usePosts();
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.map(t => t.name));
    }
  }, [post]);

  const handleLangChange = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      setSelectedLangs(selectedLangs.filter(l => l !== lang));
    } else {
      setSelectedLangs([...selectedLangs, lang]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = currentTagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      author: 'Dandy',
      summary: {
        ko: content.ko.substring(0, 100),
        en: content.en.substring(0, 100),
      },
      tags,
    };

    if (post) {
      updatePost({ ...post, ...postData });
      navigate(`/posts/${post.id}`);
    } else {
      addPost(postData);
      navigate(`/`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-4 items-center">
        <Label>{t('language')}</Label>
        <div className="flex items-center gap-2">
          <Checkbox id="lang-ko" checked={selectedLangs.includes('ko')} onCheckedChange={() => handleLangChange('ko')} />
          <Label htmlFor="lang-ko">{t('korean')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="lang-en" checked={selectedLangs.includes('en')} onCheckedChange={() => handleLangChange('en')} />
          <Label htmlFor="lang-en">{t('english')}</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selectedLangs.includes('ko') && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t('korean')}</h3>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title-ko">{t('title')}</Label>
              <Input
                type="text"
                id="title-ko"
                value={title.ko}
                onChange={(e) => setTitle({ ...title, ko: e.target.value })}
                required={selectedLangs.includes('ko')}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="content-ko">{t('content_markdown_supported')}</Label>
              <Textarea
                id="content-ko"
                value={content.ko}
                onChange={(e) => setContent({ ...content, ko: e.target.value })}
                rows={15}
                required={selectedLangs.includes('ko')}
              />
            </div>
          </div>
        )}

        {selectedLangs.includes('en') && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t('english')}</h3>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title-en">{t('title')}</Label>
              <Input
                type="text"
                id="title-en"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
                required={selectedLangs.includes('en')}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="content-en">{t('content_markdown_supported')}</Label>
              <Textarea
                id="content-en"
                value={content.en}
                onChange={(e) => setContent({ ...content, en: e.target.value })}
                rows={15}
                required={selectedLangs.includes('en')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="tags">{t('tags')}</Label>
        <Input
          type="text"
          id="tags"
          value={currentTagInput}
          onChange={(e) => setCurrentTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder={t('tags_placeholder')}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-xs text-gray-500 hover:text-gray-700">
                x
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit">{t('save')}</Button>
    </form>
  );
}
