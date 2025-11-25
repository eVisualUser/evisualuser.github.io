## Goal

The goal is to make a game engine.
To learn about it, and improve my skills.

At the same time, I love working on projects that don't rely on third-party libraries.

## Requirements

- Familiarity with C++ and modern C++ features
- Understanding of game development concepts and principles
- Experience with version control systems (e.g., Git)
- Knowledge of graphics APIs (e.g., OpenGL, Vulkan)
- Familiarity with game engine architecture and design patterns
- Experience with game engine development tools and frameworks (e.g., Unreal Engine, Unity)
- Data management and optimizations
- Multithreading and synchronization

## Current state of development

The project is currently paused, I am working on a game using Unity as I need to train using Unity.
And to add projects to my portfolio, sadly requiring to let the engine development on hold.

But it is in progress on improving the multithreading support, and improving the docs and unit tests.
A lot of the background work is already done, such as:
- General engine architecture
- Logic structure
- Data management and optimizations
- Base of the rendering engine

## Technologies

|Technology|Usage|
|----------|-----|
|[Vulkan](https://www.vulkan.org/)| Main graphic API|
|[OpenGL](https://www.opengl.org/)|Fallback graphic API|
|[SLang](https://shader-slang.org/)|Shader language|
|[LZ4](https://github.com/lz4/lz4)|Compression library|
|[GLM](https://github.com/g-truc/glm)|Algebra library|
|[GLFW](https://www.glfw.org/)|Cross-platform window management|
|[PugiXML](https://pugixml.org/)|XML Parser|
|[VMA](https://gpuopen.com/vulkan-memory-allocator/)|Helper library for Vulkan|
|[Corrosion](https://gpuopen.com/vulkan-memory-allocator/)|Library to allow using Rust code (not used yet, but will be used later for scripting)|
|[Tracy](https://github.com/wolfpld/tracy)|Profiler complete, open-source and easy to use|
|[Stringzilla](https://github.com/ashvardanian/Stringzilla)|Future-proof choice, to avoid strings becoming a bottleneck|
|[Doctest](https://github.com/doctest/doctest)|Unit testing framework|

## Inspirations

### Unity

For the versatility and the ease of use.

Also help to understand how to manage assets and resources properly.

### Unreal Engine

For editing, and scripting.

## Bevy

For the ECS architecture and the flexibility.

## General Architecture

The engine is contained in a class named Engine.

<img src="./assets/code/pretty_engine/Main.png" width="400" height="200"/>

All the custom logic is loading using a reflection system.

<img src="./assets/code/pretty_engine/PlayerComponent.png" width="500" height="200"/>
<img src="./assets/code/pretty_engine/PlayerSystem.png" width="500" height="350"/>
<img src="./assets/code/pretty_engine/GameProcess.png" width="500" height="200"/>

### Engine Initialization

Surely, all engine parts are initialized in async, launched by the Engine::Load() function.
It is blocking the current thread until all parts are loaded.

Allowing a fast initialization of the engine.
And you can add a loading screen if you want, while the Load() function is running.

Then you only need to tell the engine Engine::Run() to start the game loop.

It will use many threads, but if the CPU cannot handle it, it will use the main thread.
But from the User side code, the thread limit can be omitted as the engine will handle correctly the overload.

PS: If you use the task launching system, you can't have too many threads, as it will reuse the workers.
It uses the main thread only when you have a dedicated worker thread.

### Rendering

It uses a concept of Render components, where each component can be Activated or Deactivated, receive update events each frame, and can be Refreshed if necessary (example: resolution changed).
This allows you to easily separate rendering tasks and can detect if a Component takes time to run.

They are also receiving an event when an error, warning, or info is sent in the renderer, from the exterior or from the Renderer itself.
If they send an error, they may be refreshed, to avoid crashing the application.

Components can deactivate themselves if they are no more useful.
Each component have access to other components, to allow working together, and can have SharedRenderComponentData, to share data between components.

I am currently working on finding out how to correctly implement graphics API fallback, without an extensive number of code lines.

<img src="./assets/code/pretty_engine/MM_RenderComponentLogic.png" width="250" height="850"/>
<img src="./assets/code/pretty_engine/MM_RenderComponent.png" width="400" height="400"/>

### Gameplay logic

The logic is contained in a class named Space.
The space have a specific interface towards the engine.
Allowing to safely control the engine. Meaning you don't need great knowledge of the engine to use it.

In the other side, you have the Process, that are in the engine.
And are kind of unsafe, but receive a lot of events, and can do whatever you want with the engine.
Can be useful to add complex features.

## Why Vulkan and OpenGL

DirectX is a proprietary API, and is not open source.
Vulkan and OpenGL are open source, and can be more flexible and powerful than DirectX.
They are also more widely used, and have more documentation and tutorials.

The combo is Vulkan and OpenGL also have an advantage, as you can share data between them.
So switching to OpenGL to avoid a crash would be faster and more reliable.

And last but not least, Vulkan and OpenGL are both cross-platform.

## GitLab

I moved from GitHub to GitLab.
Because I wanted to not rely only on GitHub.
And I could self-host my own GitLab instance.

## Conclusion

The engine still requires a lot of work, but it is on the good way.
I don't have a precise date on when it will be ready, but I am working on it.
