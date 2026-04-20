## Slot Engine and React/Pixi Client

To run:

```bash
cd application
```

```bash
npm run dev
```

This project is split into two parts:
- **Engine**: decides game logic and outcomes.
- **Client**: shows visuals and UI based on engine output.

### Engine (Game Logic)

- RNG and outcome generation
- bet/balance validation
- win calculation
- timeline creation - sequential batched commands

A spin runs in the engine first. The result is a timeline of commands such as `SPIN_START` and `REEL_STOP`.

-- Timeline generation needs a bit of work: My vision is to make its concurrency a bit better to support game features, running in paralel or in sequence easier. More structured way of generation of "commands" to get rid of boilerplates.
Still my vision for the engine is not clear, if I want it in a way that it dicatates all game timeline (math, client -> pros: all outcomes would come from engine, good for replays, might include co-work for server/client devs). Still need to think to bring comfort of DX and business requirements of fast and easy development together.

Architecture image: `public/engine_arch.webp`

### Client (React + Pixi)

The client is responsible for presentation and interaction:
- **React** renders UI (controls, balance, win, mode)
- **Zustand** stores mirrored game state
- **Pixi** renders reels/symbol animations
- **GameController + TimelineExecutor** coordinates game and attaches command handlers for engine commands.

The client does not calculate outcomes. It receives engine commands and plays them in order.

As for now, client architecture is just something simple to work on top of engine, I need to solidify it to ensure growth wouldn't be a downfall.

Architecture image: `public/client_arch.png`

### Simple Runtime Flow

1. **Spin** is initiated
2. Interactions are disabled
3. `GameController` calls `engine.play()`
4. Engine returns timeline commands 
5. Client state is updated with response
6. `TimelineExecutor` dispatches commands to handlers -> some update state, some call gameElements and dicatate actions
7. Once execution of all commands are done, game because available
8. UI updates from Zustand store


----
1. Pixi Integration:
Chose to go by just embedding application to the canvas and controlling separately. Did think about pixi/react, haven't used it before but didn't want to take the risk of falling to performance bottlenecks while trying to use it "react" way.

2. Zustand Store:
Chose to stay away from React.Context, for now Pixi.Application is not heavily reliant on state, but deploying and accessing zustand store makes the Pixi.Application not be reliant on react logic. 

3. Engine: 
I wanted to not have logic all over the client and a slot game requires in some sense managable foundation to build the client on top of it. Idea was to make the game on data first, introduce a way of dicatating (commands and timeline) and build client in a way that it only reacts, doesn't try to calculate things on top of outcome

4. Shared code:
I did move here some of my logic from other games, mainly to the /renderer directory.

Both for Engine and Client my main vision was to try to make as much as ground for composition so switching logics would be easy.

My workflow from 0 to final went as below:
1. Prepare Engine MVP
2. Prepare Client MVP and integrate Engine to field test it
3. Made adjustments to Engine and reflect those changes on Client
4. Come back to Engine to prepare Win and Cascade command generations
5. Implement win feedback on client
6. Implement Cascade handling in client: command and Machine api
7. Wrap up, prepare handover docs

Hope you can navigate the repository easily, sorry for the lack of good code documentation. If any questions feel free to ping in repository. Would be grateful if you can provide any feedback.
