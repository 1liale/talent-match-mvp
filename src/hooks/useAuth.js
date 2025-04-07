'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    getUser();

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut
  };
} 