# Overview of Yjs

Yjs is a powerful library that enables real-time data synchronization between multiple users without worrying about conflicts. This section provides an overview of how Yjs works, helping you grasp the key concepts before diving into specific details. After reading, you should refer to the official Yjs documentation to gain a deeper understanding and apply it effectively to your project.

**Install Yjs**

```bash
npm install yjs
```

Refs:

- [Main source | Yjs Docs](https://docs.yjs.dev/)

# Shared type

Shared types are a special kind of data structure in Yjs, both familiar and unique. While common data types like `string`, `array`, and `map` only allow one person to manipulate them at a time, shared types open up the possibility for multiple people to edit simultaneously while still ensuring no conflicts occur.

The secret lies in the fact that shared types are built on **CRDT** _(Conflict-free Replicated Data Type)_, a highly intelligent distributed data synchronization algorithm. Instead of worrying about who edits first or last, CRDT records every change as immutable items _(e.g., add, delete, edit text)_ and automatically merges them, regardless of execution order. Thanks to this, everyone can work at the same time and the data remains consistent. If you want to learn more about CRDT, check out [here](https://crdt.tech/) _(A great [blog](https://zed.dev/blog/crdts) explaining CRDT by the Zed Editor team)_.

> CRDT does not resolve conflicts in the traditional way, but instead automatically merges all changes from users together intelligently, thanks to the way Shared Types are designed.

Yjs provides several shared types ready for use:

| Shared Type     | Short Description                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Y.Map`         | Key-value structure similar to JS `Map`, used for storing metadata or tree structures                            |
| `Y.Array`       | Collaborative array, supports simultaneous addition/removal of elements                                          |
| `Y.Text`        | Real-time editable text string, used for editors or notes                                                        |
| `Y.XmlFragment` | Root of an XML structure, contains child elements                                                                |
| `Y.XmlElement`  | An XML element that can contain attributes and child elements                                                    |
| `Y.XmlText`     | Text inside an XML element, collaboratively editable (this is the main data type for working with Slate content) |

To track changes in a shared type, simply register an observer using the `observe` function on that shared object.

> **_Example._** _Observe changes to the page title content_
>
> ```tsx
> const titleShared = ydoc.get("title", Y.Text); // Get shared type (will be mentioned in the `yDoc` section)
>
> // Observer function
> const observer = () => {
>   console.log("Title changed:", titleShared.toString());
> };
> titleShared.observe(observer);
>
> // Remember to unobserve when no longer needed
> titleShared.unobserve(observer);
> ```
>
> After registering, any place that observes will have its `observer` function called whenever the content changes _(this change can come from another user anywhere)_. Thanks to this, components sharing the same data will always be instantly synchronized _(for example: when the page title changes, the sidebar will immediately update the page name)_.

For more complex shared types like `Y.Map`, `Y.Array`, or `Y.XmlText`, you can track deep changes using the `observeDeep` function – very useful when you want to listen to all changes in nested data _(e.g., observing a `Y.Text` inside a `Y.Map`)_.

Creating Shared type data will be discussed in the yDoc section.

- Learn more: [Shared Types | Yjs](https://docs.yjs.dev/api/shared-types)
- Project variable naming convention: `<name>Shared` _e.g.: `titleShared`, `contentShared`_

# yDoc

Each document page consists of multiple shared types, all managed within an object called yDoc. yDoc represents all the data of a document page. To visualize, you can refer to the illustration below:

> **_Example._** _A document page in Giấy has 3 main content sections: Icon, Title, Content_
>
> <p align="center">
>   <img height="420" alt="Image of the structure of a document page" src="https://github.com/user-attachments/assets/9852bfd8-d915-4a52-8229-77670ea3604d" />
> </p>
> These three sections correspond to three separate shared types, all centrally managed by yDoc. In other words, yDoc is the "document page" – all data and changes of the page are contained within yDoc.

- Learn more: [Y.Doc | Yjs](https://docs.yjs.dev/api/y.doc)
- Project variable naming convention: `<name>Doc` _e.g.: `pageDoc`, `workspaceDoc`_

### Initialize yDoc

To create a yDoc, simply instantiate a new object from Yjs:

```ts
import * as Y from "yjs";

const yDoc = new Y.Doc();
```

### Create and get Shared Type from yDoc

Once you understand shared types, you'll see that all collaborative data types are created and managed through yDoc. Creating a shared type in yDoc is extremely flexible: just call the `yDoc.get()` method, name your shared variable, and specify the desired data type _(This method not only creates but also retrieves if it already exists)_:

> **_Example._** _Get data of type Y.Map_
>
> ```ts
> const mapDataShared = yDoc.get("map-data", Y.Map);
> ```

> **_Example._** _Get 2 Shared data: Title, Content_
>
> ```ts
> import * as Y from "yjs";
>
> const yDoc = new Y.Doc();
>
> const titleShared = yDoc.get("title", Y.Text);
> const contentShared = yDoc.get("content", Y.XmlFragment);
> ```

# Provider

After understanding shared types and yDoc, you'll encounter an important question: How do clients continuously receive the latest data when someone makes a change? This is the role of the **Provider**.

A provider acts like a "relay station" – where all clients send their changes to yDoc, and simultaneously receive the latest updates from other users. When a client edits content, the provider transmits that change to the other clients, ensuring everyone is instantly synchronized. Thanks to the provider, everyone sees the same data state, no matter where they're working.

<p align="center">
  <img height="240" alt="Provider helps clients connect with each other" src="https://github.com/user-attachments/assets/f418c6d2-475c-4cd4-9bbd-abdaa374e072" />
</p>

In other words, the provider is the bridge that keeps collaborative data flowing continuously between clients, turning even the smallest change into a real-time update for the whole group.

Providers can come in many different forms, so Yjs does not provide any built-in Provider. Instead, you can choose third-party libraries to create Providers that suit your needs.

> _You can start with simple providers like [y-webrtc](https://github.com/yjs/y-webrtc) or [y-websocket](https://github.com/yjs/y-websocket). These providers are not suitable for production environments, but they are fast and easy to use, perfect for getting an overview of how providers work._

"Giấy" uses **Hocuspocus** as its Provider. You can find the official documentation here: [https://tiptap.dev/docs/hocuspocus/](https://tiptap.dev/docs/hocuspocus/)

With Hocuspocus, its Yjs provider uses WebSocket to transmit data between clients. Therefore, this provider exists as a small server; Giấy's Hocuspocus server is only used to exchange data between clients and has no other functions.

### Create Hocuspocus Server

Create a Node.js application and install Hocuspocus with `npm install @hocuspocus/server`. Then, in the `index.js` file, set up a simple server as follows:

```ts
import { Server } from "@hocuspocus/server";

// Configure the server …
const server = new Server({
  port: 1234,
});

// … and run it!
server.listen();
```

With this setup, the Hocuspocus Server will run a WebSocket server at `ws://localhost:1234`.

### Client connects to Hocuspocus Server

First, install the `@hocuspocus/provider` library with `npm install @hocuspocus/provider`. Then you can connect as follows:

```ts
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

// Connect it to the backend
const provider = new HocuspocusProvider({
  url: "ws://127.0.0.1:1234",
  name: "example-document",
});

// Define `tasks` as an Array
const tasks = provider.document.getArray("tasks");

// Listen for changes
tasks.observe(() => {
  console.log("tasks were modified");
});

// Add a new task
tasks.push(["buy milk"]);
```
