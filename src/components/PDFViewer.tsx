"use client";

import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  // Ensure pdf_url is properly encoded for iframe src
  const encodedUrl = encodeURIComponent(pdf_url);
  const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;

  return (
    <iframe src={viewerUrl} className="w-full h-full" title="PDF Viewer" />
  );
};

export default PDFViewer;
