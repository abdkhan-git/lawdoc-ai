'use client';

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

// Define the type for the component's props
type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
    // State to track loading status of the PDF
    const [loading, setLoading] = useState(true);
    
    return (
        // Main container with styling for the PDF viewer
        <div className="flex flex-col h-full rounded-lg overflow-hidden border border-blue-100 shadow-sm bg-white">

            {/* PDF Header Section that contains the document title with a subtle blue gradient background */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600/10 to-blue-700/5 border-b border-blue-100">
                <div className="flex items-center gap-2">

                    {/* Document icon */}
                    <FileText className="h-5 w-5 text-blue-600" />
                    
                    {/* Document title - extracted from the URL and truncated if too long */}
                    <h3 className="font-medium text-gray-800 truncate max-w-md">
                        {/* Extract filename from URL by splitting on '/' and taking the last part */}
                        {/* Further split on '?' to remove query parameters */}
                        {pdf_url.split('/').pop()?.split('?')[0] || "Document"}
                    </h3>
                </div>
            </div>
            
            {/* PDF Viewer Section with Loading State */}
            <div className="flex-1 relative">
                {/* Conditional rendering of loading overlay */}
                {loading && (
                    // Semi-transparent overlay with centered loading indicator
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                        <div className="text-center">
                            {/* Animated loading spinner */}
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Loading document...</p>
                        </div>
                    </div>
                )}

                {/**
                 * PDF Viewer using Google Docs Viewer as an iframe
                 * This approach allows viewing PDFs without requiring a PDF.js implementation
                 */}
                <iframe 
                    // Use Google Docs Viewer to render the PDF
                    // The URL is encoded to ensure special characters are handled correctly
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(pdf_url)}&embedded=true`}
                    className="w-full h-full border-0"
                    
                    // When iframe loads, set loading state to false to hide the loading indicator
                    onLoad={() => setLoading(false)}
                />
            </div>
        </div>
    );
};

export default PDFViewer;
