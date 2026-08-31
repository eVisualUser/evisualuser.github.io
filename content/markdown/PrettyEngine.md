Pretty-Engine is an open-source C/C++ game engine, licensed under MIT.
Designed with a focus on multi-threading, asynchronous architecture, and production efficiency.

The project is still under active development, with many changes to come.
It is targeting Linux and Windows platforms.
The goal is to learn and experiment and produce low scale games with it.

# Goals

- **3D & UI Rendering**: High-performance Vulkan pipeline with flexible UI integration.
- **Physics & Audio**: Robust 3D physics (Jolt backend) and multi-channel audio (OpenAL).
- **Modular Architecture**: A rigid core with swappable subsystems for easy customization.
- **Multithreading**: Logic, rendering, and physics running in parallel.
- **Cross-Platform**: Primary focus on Linux/Windows.

## Challenges

- Multithreaded architecture working on a 4-core or less CPU.
- Physics, Audio, Rendering, Gameplay logic run in parallel.
- Handle long-duration tasks without impacting other systems.
- Render 3D scenes efficiently.
- Audio and Physics integrated with a swappable backend (Jolt and OpenAL).
- Windows and Linux support.
- Level streaming.
- Productive tooling.

## Ongoing work

- **Multithreading**: The scheduler allowing systems to run in parallel is planned but not finished.
- **Rendering**: Light, Shadows, Post processing, animation system.
- **Gameplay API**: Denser API simplifies game making.
- **Level Stream**: Mising entity zone transition, and loading and unloading based on position.

## Architecture

Let's explore all the concepts that are used in the engine.

### Process

Process is a class, that is loaded at startup, and unloaded once the engine end.
It has many purpose, such as game entry point, or Audio and Physics backends, and tooling.
The Process is a place where the user is trusted, in comparison to gameplay side logic.

A Process can access gameplay, but gameplay can't access a Process.
But a component can hold a pointer from a Process, as a Process once started outlive anything else.

Services hook a Process allowing to use it as a backend.
Services make sure that the backend is initialized the intended way.

```cpp
// A Process is an object loaded by reflection at startup and destroyed only at exit.
// It's the core solution to extend engine features, and also your entry point to the engine.

#ifndef GAME_PROCESS_HPP
#define GAME_PROCESS_HPP

#include "Flower.hpp"
#include "Score.hpp"
#include "PlayerSystem.hpp"
#include "PrettyEngine/Space/Process.hpp"
#include "PrettyEngine/Space/DOS/BaseComponents/MeshRendererComponent.hpp"
#include "PrettyEngine/Space/DOS/BaseComponents/UIDocumentComponent.hpp"
#include "GearSystem.hpp"
#include "GearScoreSystem.hpp"
#include "GameLoopSystem.hpp"
#include "cgc/Easy.hpp"
#include "cgc/GlobalConfig.hpp"

/// Entry point of the game.
/// It has access to everything, and can do anything you want.
class GameProcess: public PrettyEngine::Space::Process
{
public:
    // Called when the engine is ready
    void OnEngineInitializedSync() override
    {
        // We load a zone async.
        space->LoadZone("ZoneInfo", "game.zn", false, &onZoneLoaded);

        CGC::GlobalConfig::GetInstance().Load();

#if _DEBUG
        engineInterface->window.SetTitle("Gear Crush Flower - DEBUG");
#else
        engineInterface->window.SetTitle("Gear Crush Flower");
#endif

        // Process class always outlive the Space and other engine parts.

        // You could find all zone files using the asset manager:
        /*
         * if (auto assetPack = engineInterface->assetManager->GetAssetPackByPath("main.zn"))
         * {
         *    for (auto& asset: assetPack->assets)
         *    {
         *        space->LoadZone("ZoneInfo", uuids::to_string(asset.uuid), true);
         *    }
         * }
         */

        // Example of how to do a simple log
        LOG("Game process initialized");
        // There is also LOGFMT("Game process {}", "initialized") if you need more complex logs
        // They both come with LOGE (Error), LOGI (Info), LOGW (Warning)
    }

    void OnGameExit() override
    {
        CGC::GlobalConfig::GetInstance().Save();
    }

    PrettyEngine::Core::FunctionPtr<void(PrettyEngine::Space::Zone*)> onZoneLoaded {
        [](PrettyEngine::Space::Zone* zone)
        {
            // DOS aka Dynamic Object System, is an ECS derived concept, used by this project.
            // The MLock<T> type, is ensuring the synchronization of the DOSGroup, as it is a shared resource.
            const auto dosGroup = zone->GetDOSGroup();

            // For now, we must always add manually the systems, as the engine is not yet able to load them automatically.

            // Builtin systems:
            dosGroup->AddSystem<PrettyEngine::MeshRendererSystem>();
            dosGroup->AddSystem<PrettyEngine::AudioSourceSystem>();
            dosGroup->AddSystem<PrettyEngine::UIDocumentSystem>();
            dosGroup->AddSystem<PrettyEngine::Space::PhysicsSystem>();

            // Custom systems:
            dosGroup->AddSystem<GearScoreSystem>();
            dosGroup->AddSystem<GameLoopSystem>();
            dosGroup->AddSystem<PlayerSystem>();
            dosGroup->AddSystem<ScoreSystem>();
            dosGroup->AddSystem<GearSystem>();
        }
    };
};

// This macro register and reflect the class, the tag is critical for a process to be loaded at startup.
// If the tag process is missing, the engine wont load the class.
REFLECT_CLASS(GameProcess, "process");

#endif
```

### Space

It's the container of the user side logic.
This is where components and systems lives, it's where level streaming is handled.

The main way gameplay interact with the engine is using the EngineConnector, that exploits the EngineInterface under the hood.
EnginInterface is where all systems lives, except Process and Space.

### Initialized Class

This is a class, that is loaded at startup asynchronously.
Systems such as Process and Space or the Renderer are Initialized Class.

### Reflection Engine

It's the central reflection engine that allows dynamically loading and unloading classes and accessing their members.
This one will probably see modifications when source code is migrated to C++26.

Example of reflection:
```cpp
REFLECT_CLASS(AudioSourceComponent, "component",
    REGISTER_PARENT(AudioSourceSystem, Component)
    REGISTER_CLASS_PROPERTY(AudioSourceComponent, String, source)
    REGISTER_CLASS_PROPERTY(AudioSourceComponent, float, gain)
    REGISTER_CLASS_PROPERTY(AudioSourceComponent, float, pitch)
    REGISTER_CLASS_PROPERTY(AudioSourceComponent, float, range)
    REGISTER_CLASS_PROPERTY(AudioSourceComponent, bool, isPlaying)
    REGISTER_CLASS_PROPERTY(AudioSourceComponent, bool, isLooping)
);
```

Each value can be serialized by adding a PropertySerializer.
That adds serialization support and serializations of std::vector too.

### [CPP Global Config (CGC)](https://gitlab.com/eVisualUser/cpp-global-config/-/tree/1de1beb9eac56c53d6a310d120539f13b3dc8b29/)

It's the equivalent of unity Player Profile, it's a global configuration that can be accessed from anywhere in the engine.
I recommend going have a look at it.

### Dynamic Object System (DOS)

DOS is a derived from the ECS concepts.
ECS will come later inside the engine, but DOS provide a flexible way to add logic, and be productive fast.
Causing DOS to trade Cache-Friendly for simplicity, and flexibility.

But DOS still provides a high async support. With async cleanup, and query updates that can happens while systems are running.

DOS is composed of Systems and Components, each component is thread safe using an atomic flagging system.
The scheduler allowing systems to run in parralell is planned but not finished.

It is not a replacement of ECS, it is solving other problems. The main one if productivity.
And it's actually the origin of it, as while working on an ECS, I found that it was making slow to then make gameplay features.
So I derived from it to make DOS.

Example:
```cpp
/// Camera handle in the scene.
/// It's not an actual camera instance, but only update camera values.
/// Update camera only if enabled.
/// On renderer side, only one camera can exist.
class CameraComponent: public Component {
    friend class MeshRendererSystem;
public:
    /// Offset applied at each position update
    Transform<> offset;

    float fieldOfView = 60.0f;
    float nearPlane = 0.1f;
    float farPlane = 100.0f;

    /// If true, the CameraSystem will update camera based on this component.
    bool enabled = false;

    /// If different from 0, then camera follow smoothly toward new position
    float followSmoothness = 0;
    bool exponentialSmoothness = false;
};

REFLECT_CLASS(CameraComponent, "component",
    REGISTER_PARENT(CameraComponent, Component)
    REGISTER_CLASS_PROPERTY(CameraComponent, Transform<>, offset)
    REGISTER_CLASS_PROPERTY(CameraComponent, float, fieldOfView)
    REGISTER_CLASS_PROPERTY(CameraComponent, float, nearPlane)
    REGISTER_CLASS_PROPERTY(CameraComponent, float, farPlane)
    REGISTER_CLASS_PROPERTY(CameraComponent, bool, enabled)
    REGISTER_CLASS_PROPERTY(CameraComponent, float, followSmoothness)
    REGISTER_CLASS_PROPERTY(CameraComponent, bool, exponentialSmoothness)
);

class CameraSystem: public System {
public:
    void SelfInit() override {
        queryInfo.AddClass<CameraComponent>();
        queryInfo.AddClass<TransformComponent>();

        queryInfo.queryAnyEntity = true;

        systemUpdate = SystemUpdate::Update;
    }

    void OnUpdate() override {
        for (auto& bundle: query.GetOwnedPairs<CameraComponent, TransformComponent>())
        {
            const auto cameraComponent = bundle.Get<CameraComponent>();
            const auto transformComponent = bundle.Get<TransformComponent>();

            if (cameraComponent->enabled)
            {
                const auto renderSpace = engineConnector.GetRenderSpace();

                if (cameraComponent->followSmoothness == 0) {
                    renderSpace->GetCameraTransform()->position.x = transformComponent->localTransform.position.x + cameraComponent->offset.position.x;
                    renderSpace->GetCameraTransform()->position.y = transformComponent->localTransform.position.y + cameraComponent->offset.position.y;
                    renderSpace->GetCameraTransform()->position.z = transformComponent->localTransform.position.z + cameraComponent->offset.position.z;
                } else {
                    const float smoothness = cameraComponent->followSmoothness;
                    const float dt = engineConnector.GetTime()->GetDeltaTime();

                    float t = 0;

                    if (cameraComponent->exponentialSmoothness)
                        t = 1.0f - std::exp(-smoothness * dt);
                    else
                        t = std::clamp(dt / smoothness, 0.0f, 1.0f);

                    auto& cameraPos = renderSpace->GetCameraTransform()->position;
                    auto target = transformComponent->localTransform.position;

                    target.x += cameraComponent->offset.position.x;
                    target.y += cameraComponent->offset.position.y;
                    target.z += cameraComponent->offset.position.z;

                    cameraPos = cameraPos.Lerp(target, t);
                }

                renderSpace->GetCameraTransform()->rotation = transformComponent->localTransform.rotation + cameraComponent->offset.rotation;

                renderSpace->GetCameraTransform()->scale.x = transformComponent->localTransform.scale.x + cameraComponent->offset.scale.x;
                renderSpace->GetCameraTransform()->scale.y = transformComponent->localTransform.scale.y + cameraComponent->offset.scale.y;
                renderSpace->GetCameraTransform()->scale.z = transformComponent->localTransform.scale.z + cameraComponent->offset.scale.z;

                renderSpace->GetCameraSettings().FieldOfView = cameraComponent->fieldOfView;
                renderSpace->GetCameraSettings().nearPlane = cameraComponent->nearPlane;
                renderSpace->GetCameraSettings().farPlane = cameraComponent->farPlane;
            }
        }
    }
};

REFLECT_CLASS(CameraSystem, "system")
```

### Engine class

The Engine class is the container of the whole game logic.
This sample of code can explain it better than any text would do.

```cpp
// Enable useful debug tools
#if _DEBUG
    // Enable in editor console, with a basic set of command you can use
    #define ENABLE_CONSOLE
    // Enable the zone explorer to help editing zones
    #define ENABLE_ZONE_EXPLORER
    // Enable the Multithreading debugger, useful to see the load on each thread
    #define ENABLE_MT_DEBUG
#endif

// Allow the engine to find JoltPhysics and OpenAL backend.
// You need also to set the options inside CMake:
// - set(BUILTIN_JOLT_PHYSICS ON)
// - set(BUILTIN_OPEN_AL ON)
// Audio and Physics backend can be changed
#include <PrettyEngine/Service/Builtin/Jolt/JoltPhysicsProcess.hpp>
#include <PrettyEngine/Service/Builtin/OpenAL/OpenAL.hpp>

// -- LEAF HEADERS --

/*
* A "leaf header" is the terminal header in an include chain — the one that doesn't include any other engine header itself.
* It's the endpoint of a dependency graph, not a node in the middle.
* In PrettyEngine's reflection system, header inclusion order matters.
* Reflection macros expand at preprocessing time and register type metadata, so the headers containing those macros must be parsed before the engine core that consumes the registry.
* If a non-leaf header gets included first, its dependencies (which it pulls in via #include) may resolve in an order that leaves the registry incomplete at the point where the engine tries to use it.
* By requiring only leaf headers, we sidestep this entirely. Each leaf header pulls in its own dependency chain through normal #include resolution — every intermediate header gets included transitively, in the correct order, before the leaf's own content is processed. The caller only needs to know which leaf(es) correspond to the types they want reflected; the compiler handles the rest through standard include resolution.
*/

#include "GameProcess.hpp"

// For reflection purpose, the engine header should be the last
#include <PrettyEngine/Engine/Engine.hpp>

int main()
{
    // Initialization of the engine, must be called on the main thead.
    PrettyEngine::Engine::Engine engine;

    engine.Load();

    engine.Run();

    return 0;
}
```