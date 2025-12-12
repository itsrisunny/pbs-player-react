
# 📦 **pbs-player-react**

A lightweight React hook that initializes the **PBS Partner Player** using a locally bundled `player.js` file.
This package **does not render an iframe** — you provide your own iframe and pass a React ref.

Perfect for apps that need full control over the PBS iframe layout, events, and player lifecycle.

---

# 🚀 Installation

```bash
npm install pbs-player-react
```

---

# 🎬 Basic Usage

```jsx
import React, { useRef } from "react";
import usePBSPlayer from "pbs-player-react";

export default function PBSVideo() {
  const iframeRef = useRef(null);

  // Initialize PBS Player
  usePBSPlayer(iframeRef, {
    onPlay: (pos) => console.log("Playing at:", pos),
    onPause: (pos) => console.log("Paused at:", pos),
  });

  return (
    <iframe
      ref={iframeRef}
      src={VIDEO_URL}
      allow="encrypted-media; fullscreen"
      style={{ width: "100%", height: 400, border: 0 }}
    />
  );
}
```

---

# 🎛 API: `usePBSPlayer(iframeRef, options)`

### **Parameters**

| Param       | Type                                 | Required   | Description                      |
| ----------- | ------------------------------------ | ---------- | -------------------------------- |
| `iframeRef` | `React.RefObject<HTMLIFrameElement>` | ✅ Yes      | Reference to your iframe element |
| `options`   | `object`                             | ❌ Optional | Player event callbacks + config  |

---

# ⚙️ Options (Callbacks)

| Option                 | Description                             |
| ---------------------- | --------------------------------------- |
| `onMediaStart()`       | Fired when media starts                 |
| `onMediaStop(event)`   | Fired when media stops                  |
| `onSeek(position)`     | Fired when user seeks                   |
| `onPlay(position)`     | Fired when playback starts              |
| `onPause(position)`    | Fired when playback pauses              |
| `onPosition(position)` | Fires continuously during playback      |
| `playerScriptUrl`      | Optional custom location of `player.js` |

---

# 🌐 Custom Script Location (Optional)

If you want to load the script from your own server instead of the bundled file:

```jsx
usePBSPlayer(iframeRef, {
  playerScriptUrl: "/static/pbs/player.js",
});
```

---

# 🔧 Accessing Player Instance (Optional)

`usePBSPlayer` returns a `playerRef`, allowing direct calls to PBS API methods:

```jsx
const playerRef = usePBSPlayer(iframeRef);

// Example: log position every 3s
useEffect(() => {
  const interval = setInterval(() => {
    if (playerRef.current) {
      playerRef.current.getPosition().then((p) =>
        console.log("Position:", p)
      );
    }
  }, 3000);

  return () => clearInterval(interval);
}, []);
```

---

# 🏗 How It Works

* Loads the PBS `player.js` script only **once** per application
* Initializes `window.PBSPartner`
* Creates a player instance and binds it to your iframe
* Sets up event listeners
* Cleans up on unmount
* Provides the active player instance via a `ref`

---

# 🐛 Troubleshooting

### ❌ *Error: "Module not found: Can't resolve 'pbs-player-react'"*

Make sure you installed the package:

```bash
npm install pbs-player-react
```

If still failing, delete caches:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ *404 When loading player.js*

Use `playerScriptUrl` to manually point to the correct script:

```jsx
usePBSPlayer(iframeRef, {
  playerScriptUrl: "/pbs/player.js",
});
```

---

# ❤️ Contributing

Pull requests are welcome!
If you have suggestions or want new features, open an issue.

---

# 📄 License

MIT License.
