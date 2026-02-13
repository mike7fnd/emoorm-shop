// Explicit exports to avoid naming conflicts
export { supabaseConfig } from './config';

// Re-export client functions
export { getSupabaseClient, createServerClient } from './client';

// Re-export provider
export { SupabaseProvider, useSupabase, useUser, useSession } from './provider';
export { SupabaseClientProvider } from './client-provider';

// Re-export auth functions
export * from './auth';

// Re-export hooks - explicitly export types and functions to avoid WithId conflict
export type { WithId as CollectionWithId } from './hooks/use-collection';
export { useCollection, type UseCollectionResult, type UseCollectionOptions } from './hooks/use-collection';

export type { WithId as DocWithId } from './hooks/use-doc';
export { useDoc, type UseDocResult, type UseDocOptions } from './hooks/use-doc';

export { useMutations } from './hooks/use-mutations';
