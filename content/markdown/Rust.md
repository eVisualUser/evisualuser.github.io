Rust is my favorite programming language.
Thanks to its safety features, it's a great choice for tooling and game development.

## Projects

### [Flappy Editor](https://github.com/eVisualUser/flappy-editor)

[Download](https://github.com/eVisualUser/flappy-editor/releases/tag/1.0.0)

A little fun project, that allow to play a flappy bird game in a code editor.
The recomended editor is Visual Studio Code, as it must refresh the rendering of the game at each frame.

A little tips: launch visual studio code with the command 'code --disable-extensions'.

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1121291105?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="FlappyEditor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

### [Fast-Assets](https://crates.io/crates/fast-assets)

A simple asset manager for Rust.
More a learning project than for production.
But can still be useful for small projects.

Features:
- Search for files
- Index files
- Load assets
- Load compressed assets
- Dependency Checker
- File Redirect
- Write files (not compressed only)
- Download files from web
- Easy file move/copy/remove

### [Pretty-Ini](https://crates.io/crates/pretty_ini)

Simple ini file parser for Rust.
I often use it in my projects.

It allows to parse and write ini files.
With a support of pre and post processing, if you need to add custom logic before the parsing and writing process.

### [Pro-CSV](https://crates.io/crates/pro_csv)

Same as Pretty-Ini, but for CSV files.

Features:
- Read at index
- Set at index
- Find line and column using headers
- Insert and Append lines/columns
- Remove lines/columns
- Resize the table
- Save to file

### [Full-Logger](https://crates.io/crates/full_logger)

A simple logger for Rust.
It allows to log messages to a file and to the console.

Features:
- Support few file formats.
- Console log.
- Message box using fltk.
- Support logs of Result and Option.

There is also the support of a little GUI app I made that is [Log-Server](https://github.com/eVisualUser/log-server).
It was a way for me to learn Rocket, and to make a local server.

### [Unreal Engine launcher with compilation support](https://github.com/eVisualUser/game-dev-launcher)

For Echoes Of Seasons, I made a launcher that can run and compile the editor, using Unreal Engine CLI.
It's simple but was required.
Made using [Tauri](https://tauri.app/).

Warning: It is not maintained anymore, it will probably not even launch if you download the current version.
I will replace it by [Pretty-Launcher](https://gitlab.com/eVisualUser/pretty-launcher) (still work in progress).
It was a temporary solution.

<img src="assets/game_dev_launcher.png" alt="Unreal Engine launcher" width="600" height="500">
