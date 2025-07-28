import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { Node, Editor } from 'slate';

interface ChunkData {
  nodes: Node[];
  startIndex: number;
  endIndex: number;
}

export const useIntersectionChunking = (
  editor: Editor, 
  chunkSize: number = 50
) => {
  const [visibleChunks, setVisibleChunks] = useState<Set<number>>(new Set([0, 1]));
  const observerRef = useRef<IntersectionObserver>(null);
  const chunkRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Chia editor nodes thành chunks
  const chunks = useMemo(() => {
    if (!editor.children) return [];
    
    const allNodes = Array.from(editor.children) as Node[];
    const result: ChunkData[] = [];
    
    for (let i = 0; i < allNodes.length; i += chunkSize) {
      result.push({
        nodes: allNodes.slice(i, i + chunkSize),
        startIndex: i,
        endIndex: Math.min(i + chunkSize - 1, allNodes.length - 1)
      });
    }
    
    return result;
  }, [editor.children, chunkSize]);

  // Setup Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleChunks(prev => {
          const newSet = new Set(prev);
          
          entries.forEach((entry) => {
            const chunkIndex = parseInt(
              entry.target.getAttribute('data-chunk-index') || '0'
            );
            
            if (entry.isIntersecting) {
              // Add current chunk
              newSet.add(chunkIndex);
              // Preload adjacent chunks for smooth scrolling
              newSet.add(chunkIndex - 1);
              newSet.add(chunkIndex + 1);
            } else {
              // Keep minimum chunks loaded
              if (newSet.size > 5) {
                newSet.delete(chunkIndex);
              }
            }
          });
          
          return newSet;
        });
      },
      {
        rootMargin: '300px', // Load chunks 300px before visible
        threshold: 0.1
      }
    );

    // Observe existing chunks
    chunkRefs.current.forEach((element) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [chunks.length]);

  // Register chunk ref
  const registerChunkRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      chunkRefs.current.set(index, element);
      observerRef.current?.observe(element);
    } else {
      const existingElement = chunkRefs.current.get(index);
      if (existingElement) {
        observerRef.current?.unobserve(existingElement);
        chunkRefs.current.delete(index);
      }
    }
  }, []);

  return {
    chunks,
    visibleChunks,
    registerChunkRef
  };
};