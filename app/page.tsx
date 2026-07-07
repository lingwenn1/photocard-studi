"use client";

import { useEditorStore } from "@/lib/store";
import { UploadScreen } from "@/components/upload-screen";
import { EditorShell } from "@/components/editor/editor-shell";

export default function Home() {
  const imageSrc = useEditorStore((s) => s.imageSrc);

  return imageSrc ? <EditorShell /> : <UploadScreen />;
}
