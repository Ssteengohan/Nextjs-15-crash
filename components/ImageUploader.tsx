import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const simulateProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressIntervalRef.current!);
          return prevProgress;
        }

        const remaining = 90 - prevProgress;
        const increment = Math.max(0.5, remaining * 0.05);
        return Math.min(90, prevProgress + increment);
      });
    }, 100);
  }, []);

  const completeProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setProgress(100);

    setTimeout(() => {
      setProgress(0);
    }, 600);
  }, []);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError("Image must be less than 50MB");
        return;
      }

      setIsUploading(true);
      setError(null);
      simulateProgress();

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Failed to upload image");
        }

        const data = await response.json();
        onChange(data.url);
        completeProgress();
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Failed to upload image");
        completeProgress();
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, simulateProgress, completeProgress]
  );

  const formattedProgress = Math.round(progress);

  const handleRemoveImage = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("fileInput")?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {progress > 0 && (
        <div className="w-full relative">
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all ease-in-out duration-300"
              style={{
                width: `${progress}%`,
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                background: "linear-gradient(to right, #d1d5db, #4b5563)",
              }}
            />
          </div>
          <div className="mt-1 text-xs text-right font-medium text-gray-600 dark:text-gray-400">
            {formattedProgress}%
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {value && (
        <div className="mt-4 relative group">
          <img
            src={value}
            alt="Uploaded image"
            className="max-h-40 rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
