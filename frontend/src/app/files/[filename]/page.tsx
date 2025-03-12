import React from "react";

import Image from "next/image";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ filename: string }>;
}>) {
  const filename = (await params).filename;

  // Check the file extension to determine the file type
  const fileExtension = filename!.split(".").pop();

  const renderFile = () => {
    const filePath = `/files/${filename}`;

    switch (fileExtension) {
      case "mp4":
        return <video src={filePath} controls width="100%" />;
      case "pdf":
        return <iframe src={filePath} width="100%" height="600px" />;
      case "png":
      case "jpeg":
      case "jpg":
        return (
          <Image src={filePath} alt={`File: ${filename}`} width={undefined} />
        );
      default:
        return <p>Dateityp wird nicht supported</p>;
    }
  };

  return <div>{filename ? renderFile() : <p>Lädt...</p>}</div>;
}
