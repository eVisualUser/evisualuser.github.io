# Echoes of Seasons

## Overview

Echoes of Seasons is a final‑year project developed at Bellecour École.
I began the project as the sole programmer.
Later a second programmer joined after his own project was cancelled.

The concept—advancing the game by changing seasons—was approved during the second‑year design review.

Our only technical constraint was that the game had to be built with Unreal Engine 5.
Although UE5 offers impressive visual quality, we were forced to disable Lumen because no 4GB graphics card could run the game with it enabled.

## Season

Switch The season‑switch mechanic presented two main challenges:
- Memory usage
– Virtual textures mitigated the problem but still required us to keep three textures per object in memory (one for each season).
- Color transitions
– The natural interpolation produced undesirable hues. We solved this by applying custom color multiplication and subtraction within the material.

We implemented the effect entirely with Unreal’s
visual‑scripting material system, creating a Material Function
that encapsulated the seasonal texture switching.

C++ and Blueprints The bulk of the codebase was written in C++ for
performance and maintainability.
Our strategy was to keep the heavy lifting in C++ and expose the finer‑grained logic to
designers via Blueprints.

### Examples

- Character controller
– Core movement and physics handled in C++; animation state machines and UI built in Blueprint.
- Pressure plates
- Collision detection and activation logic in C++; visual effects and feedback implemented in Blueprint.

This split allowed designers to adjust gameplay behavior without needing deep
programming knowledge.

Why C++ gave us a performance edge

- Lower memory footprint compared with Blueprint‑only implementations.
- Multithreading, we could run substantial asynchronous tasks on worker threads.
- Fine‑grained control
- Complex algorithms and expensive math operations were easier to optimise in native code.

## The Downside of Unreal Engine 5

UE5 is a powerful engine, but it can become a liability when asset
performance isn’t closely monitored.

High‑resolution models and textures quickly inflated memory consumption.
Even with careful coding, the engine itself was the primary source of the
performance bottleneck.

- Lumen had to be disabled; with it enabled, any GPU under 6GB struggled to run the game.
- RenderDoc helped us identify that UE5’s rendering pipeline was the main driver of video‑memory usage.
- Unreal Insights confirmed that our own code contributed minimally to the performance issues.

In short, without a dedicated person overseeing performance budgets, the engine’s default settings made the game expensive to run.

## What I Would Do Differently -

Define performance expectations early and communicate them
clearly to the whole team.

- Spend more time on architecture before jumping into rapid prototyping.
- Write unit tests from the start, even when feature delivery feels urgent.

- Enforce documentation across all disciplines (code, assets, design).
- Adopt stricter Git practices (branch naming, commit messages).
- Replace ad‑hoc Discord task coordination with a shared to‑do list or Kanban board.

- Favor simplicity over overly complex solutions that risk overrunning schedule constraints.
- Implement rigorous asset management, including naming conventions and size limits.

### Expected

Impact of Those Changes Had we applied the above practices, we would have saved considerable time during the latter stages of production.

Specifically:
- Fewer late‑stage performance optimisations would have been necessary.
- Clearer task ownership would have reduced duplicated effort and confusion in Discord.
- Consistent commit messages and documentation would have made code reviews and debugging faster.
- Early unit testing would have caught regressions before they became costly to fix.

## Conclusion

Despite the challenges, the project was a success.
The team collaborated effectively, delivered a functional game, and ultimately produced a product we’re proud of.

The experience taught us valuable lessons about performance awareness, communication, and disciplined workflow, all of which
will shape how we approach future projects.
