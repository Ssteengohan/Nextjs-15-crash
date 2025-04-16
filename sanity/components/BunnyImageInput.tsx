"use client";

import { StringInputProps, useClient, set } from "sanity";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { css } from "@emotion/css";
import { Box, Card, Stack, Text } from "@sanity/ui";

export function BunnyImageInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;
  const [imageUrl, setImageUrl] = useState<string | undefined>(value);

  const handleImageChange = (url: string) => {
    onChange(set(url));
    setImageUrl(url);
  };

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  return (
    <Stack space={3}>
      <Card
        padding={4}
        radius={2}
        shadow={1}
        className={css`
          background-color: var(--card-bg-color);
        `}
      >
        <ImageUploader value={imageUrl} onChange={handleImageChange} />
      </Card>
    </Stack>
  );
}
