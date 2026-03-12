import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setAuthenticated(!!user);
    setLoading(false);
    // #region agent log
    fetch('http://127.0.0.1:7854/ingest/ef127c7f-c9d5-4790-868a-0089cfe19cfd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'04450d'},body:JSON.stringify({sessionId:'04450d',location:'ProtectedRoute.tsx:checkAuth',message:'Auth check',data:{authenticated:!!user},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
