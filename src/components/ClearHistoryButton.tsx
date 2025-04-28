'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ClearHistoryButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClearHistory = async () => {
    setLoading(true);
    try {
      await axios.delete('/api/clear-history');
      toast.success('Your history has been cleared');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="relative w-full p-3 bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 shadow-md">
        <p className="text-sm text-blue-100 mb-3">
          This will permanently delete all your documents and chats. Are you sure?
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            className="bg-transparent border border-blue-400 text-blue-300 hover:bg-blue-800/40 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearHistory}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Clearing...
              </>
            ) : (
              'Clear All'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="ghost"
      className="w-full text-blue-300 hover:text-white hover:bg-blue-800/50 border border-transparent hover:border-blue-700/50 backdrop-blur-sm transition-all"
    >
      <Trash2 className="mr-2 w-4 h-4" />
      Clear History
    </Button>
  );
};

export default ClearHistoryButton;