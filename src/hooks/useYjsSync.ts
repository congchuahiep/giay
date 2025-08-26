import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { saveDocumentToSQLite } from "@/services/documentStorage";
import { isTauri } from "@tauri-apps/api/core";
import type { EditorStatus } from "./useYjsDocument";

export function useYjsSync(
  documentId: string,
  yDoc: Y.Doc | null,
  sharedType: Y.XmlText | undefined,
  provider: WebsocketProvider | undefined,
  isConnected: boolean,
  setStatus: (status: EditorStatus) => void
) {
  // Sử dụng ref để luôn có giá trị mới nhất của isConnected trong callbacks
  const isConnectedRef = useRef(isConnected);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // Sync/cập nhập dữ liệu khi có một người khác chỉnh sửa nội dung
  useEffect(() => {
    if (!provider || !yDoc) return;

    const handleSync = (isSynced: boolean) => {
      if (isSynced) {
        setStatus("saving");
        saveDocumentToSQLite(documentId, yDoc).finally(() => {
          setStatus(isConnectedRef.current ? "connected" : "offline");
        });
      }
    };

    provider.on("sync", handleSync);

    return () => {
      provider.off("sync", handleSync);
    };
  }, [provider, yDoc, documentId, setStatus]);

  // Lưu document xuống SQLite định kỳ khi người dùng chỉnh sửa
  useEffect(() => {
    if (!yDoc || !sharedType) return;
    if (!isTauri()) return;

    const observer = () => {
      setStatus("saving");
      saveDocumentToSQLite(documentId, yDoc).finally(() => {
        setStatus(isConnectedRef.current ? "connected" : "offline");
      });
    };

    sharedType.observeDeep(observer);

    return () => {
      sharedType.unobserveDeep(observer);
    };
  }, [yDoc, sharedType, documentId, setStatus]);
}
