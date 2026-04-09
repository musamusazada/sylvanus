Draft:

Engine dictates, game acts.

App division:

- Engine
    slot game engine for game to interact with.
    Responsibilities:
    - accept request
    - generate outcome
    - build sequence
    - resolve

    ---
    Vision:
    - Sequencer engine:
        - Framework agnostic, dictates game flow and state
        e.g:
        Spin -> Stop -> Win Presentation -> Sequence Complete
        - Sequences are batched array of commands (Timeline of a play) to support concurrency
    
    Draft plan:
    - config/ 
        - symbols config, weights etc
    - state/
        - engine state
    - models/
        - grid
        - reel
        - cell
    - math/
        - rng
        - evaluator
        - strategies/
            - spin
            - cascade
    - sequencer/
        - timelineBuilder
        - generators/
            - spin
            - cascade
    
    Final product vison:
    
    - Bootstrap engine w config (rows,cols,paylines, symbols?)
    - init state
    - rng -> generate final outcome
    - evaluator -> check new board
    - timeline -> build the gameplay sequence payload
    - resolve -> transcation, state, timeline
- Game

Draft:
(Come back later after engine implementation is done to plan further)

Libs?
- pixi-react for pixi integration
- zustand for state ?
- mitt for signals ?

Vision:

/assets

/configs

ui/
 - current bet and controls, balance, last win and won combination, game buttons: mode switch toggle and spin
    - css grid should be sufficient to build a responsive layout
/renderer
 - machine - reels, reel spin system, animation handler (gsap, if have time, check potential anime.js)

Game acts on signals respective to the timeline provided by engine response.
Handle signals to update store and game elements