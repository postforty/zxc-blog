import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload, Link as LinkIcon, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AIContextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (context: { urls: string[]; files: File[] }) => void;
  title: string;
  description: string;
  isLoading: boolean;
}

export function AIContextDialog({
  open,
  onOpenChange,
  onGenerate,
  title,
  description,
  isLoading,
}: AIContextDialogProps) {
  const { t } = useTranslation();
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = () => {
    if (currentUrl && !urls.includes(currentUrl)) {
      setUrls([...urls, currentUrl]);
      setCurrentUrl("");
    }
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onGenerate({ urls, files });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>External URLs (YouTube, Web Pages)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddUrl}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {urls.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded-md">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <LinkIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{url}</span>
                    </div>
                    <button onClick={() => handleRemoveUrl(index)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Reference Files (PDF, Audio)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf,audio/*"
                onChange={handleFileSelect}
              />
            </div>
            {files.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded-md">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button onClick={() => handleRemoveFile(index)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
