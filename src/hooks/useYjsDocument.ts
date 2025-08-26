import { useState, useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { loadDocumentFromSQLite } from "@/services/documentStorage";
import { isTauri } from "@tauri-apps/api/core";
import useOnlineStatus from "./useOnlineStatus";

export type EditorStatus =
  | "initial"
  | "connecting"
  | "connected"
  | "offline"
  | "saving";

export function useYjsDocument(websocketUrl: string, documentId: string) {
  // Trạng thái kết nối mạng
  const isOnline = useOnlineStatus();
  // Trạng thái kết nối với websocket
  const [isConnected, setIsConnected] = useState(false);
  // Trạng thái của editor hiện tại
  const [status, setStatus] = useState<EditorStatus>("initial");

  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [sharedType, setSharedType] = useState<Y.XmlText | undefined>(
    undefined
  );
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(
    undefined
  );

  // Khởi tạo document
  useEffect(() => {
    async function initDocument() {
      try {
        setStatus("initial");

        // Thử load document từ SQLite (chỉ load khi sử dụng ứng dụng Tauri)
        let doc = isTauri() ? await loadDocumentFromSQLite(documentId) : null;

        // Nếu không tìm thấy, tạo document mới
        if (!doc) {
          doc = new Y.Doc();
        }

        const sharedDoc = doc.get("slate", Y.XmlText);
        setYDoc(doc);
        setSharedType(sharedDoc);

        // Nếu không có kết nối mạng => offline
        if (!isOnline) {
          setStatus("offline");
          return;
        }

        // Nếu có kết nối mạng, tiến hành kết nối với websocket provider
        setStatus("connecting");
        const websocketProvider = new WebsocketProvider(
          websocketUrl,
          documentId,
          doc
        );

        // Lắng nghe sự kiện kết nối
        websocketProvider.on("status", (event) => {
          setIsConnected(event.status === "connected");
          setStatus(event.status === "connected" ? "connected" : "offline");
        });

        setProvider(websocketProvider);
      } catch (error) {
        console.error("Error initializing document:", error);
        setStatus("offline");
      }
    }

    initDocument();

    return () => {
      provider?.disconnect();
      provider?.destroy();
      yDoc?.destroy();
    };
  }, [documentId, isOnline]);

  // Xử lý trạng thái online/offline
  useEffect(() => {
    if (!provider || !yDoc) return;

    if (isOnline) {
      setStatus("connecting");
      provider.connect();
    } else {
      setStatus("offline");
      provider.disconnect();
    }
  }, [isOnline, provider, yDoc]);

  return {
    yDoc,
    sharedType,
    provider,
    status,
    setStatus,
    isConnected,
  };
}
