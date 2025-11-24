import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import * as Diff from "diff";
import { useMemo } from "react";

interface GrammarFixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  correctedText: string;
  onAccept: () => void;
}

export function GrammarFixDialog({
  open,
  onOpenChange,
  originalText,
  correctedText,
  onAccept,
}: GrammarFixDialogProps) {
  const { t } = useTranslation();

  const diffs = useMemo(() => {
    return Diff.diffChars(originalText, correctedText);
  }, [originalText, correctedText]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>{t("grammar_fix_comparison") || "Grammar Fix Comparison"}</DialogTitle>
          <DialogDescription>
            {t("grammar_fix_description") || "Review the changes before applying them."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              {t("original") || "Original"}
            </h4>
            <div className="p-4 border rounded-md bg-muted/50 min-h-[200px] whitespace-pre-wrap text-sm font-mono">
              {diffs.map((part: Diff.Change, index: number) => {
                if (part.added) return null;
                return (
                  <span
                    key={index}
                    className={part.removed ? "bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100" : ""}
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-green-600">
              {t("corrected") || "Corrected"}
            </h4>
            <div className="p-4 border rounded-md border-green-200 bg-green-50/50 dark:bg-green-900/20 min-h-[200px] whitespace-pre-wrap text-sm font-mono">
              {diffs.map((part: Diff.Change, index: number) => {
                if (part.removed) return null;
                return (
                  <span
                    key={index}
                    className={part.added ? "bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-100" : ""}
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button onClick={onAccept}>
            {t("apply") || "Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
