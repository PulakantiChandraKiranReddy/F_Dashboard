"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseRealtimeDataOptions {
  table: string;
  select?: string;
  filter?: (query: any) => any;
  enabled?: boolean;
}

interface BaseRecord {
  id: string;
  [key: string]: any;
}

export function useRealtimeData<T extends BaseRecord = BaseRecord>({
  table,
  select = "*",
  filter,
  enabled = true,
}: UseRealtimeDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let query = supabase.from(table).select(select);

    // Apply custom filters if provided
    if (filter) {
      query = filter(query);
    }

    // Initial data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: initialData, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setData((initialData as unknown as T[]) || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          // console.log("Real-time update:", payload);

          setData((prevData) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prevData, payload.new];
              case "UPDATE":
                return prevData.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                );
              case "DELETE":
                return prevData.filter((item) => item.id !== payload.old.id);
              default:
                return prevData;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, select, enabled]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

// Specific hooks for common use cases with optimized filtering
export function useExpenses() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const result = useRealtimeData({
    table: "expenses",
    select: "id, title, amount, category, created_at, notes, user_id",
    filter: (query) => (user ? query.eq("user_id", user.id) : query),
    enabled: !!user && !loading,
  });

  return {
    ...result,
    loading: result.loading || loading,
  };
}

export function useIncome() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const result = useRealtimeData({
    table: "income",
    select: "id, amount, source, description, date, user_id",
    filter: (query) => (user ? query.eq("user_id", user.id) : query),
    enabled: !!user && !loading,
  });

  return {
    ...result,
    loading: result.loading || loading,
  };
}
