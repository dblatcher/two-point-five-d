import { Color } from "@/canvas/Color";
import { Direction } from "@/game-classes/Direction";
import { Level } from "@/game-classes/Level";
import { Vantage } from "@/game-classes/Vantage";
import { Wall } from "@/game-classes/Wall";
import { Item } from "@/game-classes/Item";
import { Controller } from "@/game-classes/Controller";
import { Door, InteractableWallFeature } from "@/game-classes/WallFeature";


import { doorway, spikey } from "@/instances/wallShapes"
import { sprites as sharedSprites } from "@/instances/sprites";
import * as features from "@/travels-in-generica/features"
import { sprites } from "./sprites";
import { itemTypes } from "./itemTypes"
import { Behaviour, decisionFunctions } from "@/game-classes/Behaviour";
import { NonPlayerCharacter } from "@/rpg-classes/NonPlayerCharacter";
import { Sky } from "@/game-classes/Sky";

import { makeChurch } from "./buildings/church";
import { makeHut } from "./buildings/hut";
import { QuestHook } from "@/rpg-classes/Quest";



const door3 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const keyhole = new InteractableWallFeature({ sprite: sharedSprites.keyHole, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true })

const church = makeChurch(0, 0)
const hut1 = makeHut(6, 0, new Color(120, 90, 90))
const hut2 = makeHut(9, 6, new Color(120, 120, 90), Direction.north)
const hut3 = makeHut(1, 6, new Color(128, 90, 90), Direction.east)
const hut4 = makeHut(6, 8, new Color(128, 90, 90), Direction.north)
const hut5 = makeHut(10, 3, new Color(128, 90, 90), Direction.west)

church.walls[0].data.features = [features.staircaseA.down]
hut3.walls[0].data.features = [features.torch]
hut3.walls[1].data.features = [features.torch]
hut3.walls[2].data.features = [features.torch]
hut3.walls[2].data.features = [features.torch]
hut3.walls[3].data.features = [features.torch]
hut3.walls[4].data.features = [features.torch]
hut3.walls[5].data.features = [features.torch]


const level1: Level = new Level({
    height: 10, width: 15,
    startingVantage: { x: 3, y: 7, direction: Direction.north },

    sky: new Sky({
        skyBaseColor: new Color(140, 150, 250),
        sun: true,
    }),

    walls: [
        ...church.walls,
        new Wall({ x: 2, y: 2, place: Direction.north, patternSprite: sharedSprites.brickWall, shape: doorway, features: [door3, keyhole], open: true }),
        ...hut1.walls,
        ...hut2.walls,
        ...hut3.walls,
        ...hut4.walls,
        ...hut5.walls,

    ],

    squaresWithFeatures: [
        ...church.ceilings,
        ...hut1.ceilings,
        ...hut2.ceilings,
        ...hut3.ceilings,
        ...hut4.ceilings,
        ...hut5.ceilings,
    ],

    items: [
        new Item({
            type: itemTypes.bardHat, vantage: new Vantage({ x: 8.2, y: 6.2, direction: Direction.north })
        }),
        new Item({
            type: itemTypes.helmet, vantage: new Vantage({ x: 5.5, y: 4.5, direction: Direction.north })
        }),
    ],

    actors: [

        new NonPlayerCharacter({
            sprite: sprites.orc,
            behaviour: new Behaviour(decisionFunctions.moveClockwise),
            vantage: new Vantage({ x: 10.5, y: 0.5, direction: Direction.south }),
            name: "Roger the orc",
        }),

        new NonPlayerCharacter({
            sprite: sprites.smith,
            vantage: new Vantage({ x: 1.5, y: 7.5, direction: Direction.east }),
            talkMessage: "Wanna buy a hammer?",
            name: "George the blacksmith",
        }),
        new NonPlayerCharacter({
            sprite: sprites.farmer2,
            behaviour: new Behaviour(decisionFunctions.wanderAround),
            vantage: new Vantage({ x: 8.25, y: 4.25, direction: Direction.north }),
            talkMessage: "I am taking my turnips to the market.",
            name: "John the farmer",
        }),
        new NonPlayerCharacter({
            sprite: sprites.farmer,
            behaviour: new Behaviour(decisionFunctions.walkInCircle),
            vantage: new Vantage({ x: 6.25, y: 6.25, direction: Direction.west }),
            talkMessage: "I should get back to the cows.",
            name: "Roger the herdsman",
        }),

        new NonPlayerCharacter({
            sprite: sprites.armedMan,
            vantage: new Vantage({ x: 10.75, y: 5.75, direction: Direction.north }),
            talkMessage: "They aren't offering enough money for me to fight any monsters.",
            name: "Harry Longblade",
        }),

        new NonPlayerCharacter({
            sprite: sprites.guard2,
            vantage: new Vantage({ x: 5.25, y: 7.25, direction: Direction.north }),
            talkMessage: "Abide by the laws and we won't have any trouble.",
            name: "Corporal Mack",
            behaviour: new Behaviour(decisionFunctions.moveBackAndForward),
        }),

        new NonPlayerCharacter({
            sprite: sprites.guard3,
            vantage: new Vantage({ x: 4.5, y: 3.5, direction: Direction.south }),
            talkMessage: "I'm just a guard.",
            name: "Corporal Colin",
            questHooks: [
                new QuestHook({
                    questId: "questOne",
                    action: "GIVE",
                    message:"Old Father Dunlaw in there messed up the last rites on dead wizard and now the crypt is full of skeletons. Can you smash them up for him?",
                    acceptMessage: "Great. This is key to the crypt, just go into the chapel and down the stair. Speak to Father Dunlaw when you're done.",
                    refuseMessage: "Whatever... I'm not going down there.",
                }),
            ]
        }),

        new NonPlayerCharacter({
            sprite: sprites.redMonk,
            vantage: new Vantage({ x: 3.5, y: 0.5, direction: Direction.south }),
            name: "Father Dunlaw",
            talkMessage: "Welcome to Saint Bernard's Chapel.",
            questHooks: [
                new QuestHook({
                    questId: "questOne",
                    action: "GIVE",
                    message:"The dead have risen in the church crypt. Rather embarassing, actually. Please put them to rest by smashing their bones.",
                    acceptMessage: "Thank you - here is the key to the crypt. The stairs down are behind the door over there.",
                    refuseMessage: "Oh well... maybe someone braver will come along. hopefully before the bishop's inspection.",
                }),
                new QuestHook({
                    questId: "questOne",
                    action: "REMIND",
                    message: "How are you getting on in the crypt?"
                }),
                new QuestHook({
                    questId: "questOne",
                    action: "REWARD",
                    message: "Bless you, my children. Now the dead can sleep easy again... as can I."
                }),
            ]
        }),
        new NonPlayerCharacter({
            sprite: sprites.innKeeper,
            vantage: new Vantage({ x: 6.5, y: 2.25, direction: Direction.south }),
            name: "Widow Elsa",
            talkMessage: "No rooms for the likes of you!",
        }),

    ],

    controllers: [

        new Controller({ inputs: [keyhole], subject: door3, statusChangeOnInputTrigger: "OPEN" }),
    ]
}).withWallsAround({ color: Color.GREEN, shape: spikey })



export { level1 }