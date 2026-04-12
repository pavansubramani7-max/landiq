import { useState, useCallback } from 'react';
import { analyzeProperty, uploadDocument } from '../utils/api';
import toast from 'react-hot-toast';

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (formData, docFile) => {
    setLoading(true);
    setError(null);
    try {
      let payload = { ...formData };
      if (docFile) {
        const uploaded = await uploadDocument(docFile);
        payload._doc_path = uploaded.file_path;
      }
      const data = await analyzeProperty(payload);
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Analysis failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setResult(null); setError(null); }, []);

  return { result, loading, error, run, reset };
}
