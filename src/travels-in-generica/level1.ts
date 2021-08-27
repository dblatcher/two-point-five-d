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
import { Monster } from "@/rpg-classes/Monster";
import { CharacterStats } from "@/rpg-classes/CharacterStats";

import * as monsterDecisionFunctions from "./monsterBehaviour";
import { makeChurch } from "./buildings/church";
import { makeHut } from "./buildings/hut";



const door3 = new Door({ sprite: sharedSprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const keyhole = new InteractableWallFeature({ sprite: sharedSprites.keyHole, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true })

const church = makeChurch(0,0)
const hut1 = makeHut(6,0, new Color(120,90,90))
const hut2 = makeHut(9,6, new Color(120,120,90), Direction.north)
const hut3 = makeHut(1,6, new Color(128,90,90), Direction.east)
const hut4 = makeHut(6,8, new Color(128,90,90), Direction.north)

const level1: Level = new Level({
    height: 10, width: 15,
    startingVantage: { x: 3, y: 7, direction: Direction.north },

    sky: new Sky({
        skyBaseColor: new Color(140, 150, 250),
        sun: true,
    }),

    walls: [
        ...church.walls,
        new Wall({ x: 2, y: 2, place: Direction.north, patternSprite:sharedSprites.brickWall, shape: doorway, features: [door3, keyhole], open: true }),
        ...hut1.walls,
        ...hut2.walls,
        ...hut3.walls,
        ...hut4.walls,

        new Wall({ x: 9, y: 3, place: Direction.east, color: new Color(120, 40, 20), features: [features.staircaseA.down] }),

    ],
    squaresWithFeatures: [
        ...church.ceilings,
        ...hut1.ceilings,
        ...hut2.ceilings,
        ...hut3.ceilings,
        ...hut4.ceilings,
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

        new Monster({
            sprite: sprites.orc,
            behaviour:new Behaviour(monsterDecisionFunctions.beMonster),
            vantage: new Vantage({x:10.5, y:0.5, direction:Direction.south}),
            stats: new CharacterStats([10,10],[10,10]),
        }),

        new NonPlayerCharacter({
            sprite: sprites.farmerSprite,
            // behaviour:new Behaviour(decisionFunctions.moveBackAndForward),
            vantage: new Vantage({ x: 8.25, y: 4.25, direction: Direction.north }),
            talkMessage: "I am taking my turnips to the market.",
            name: "John the farmer",
        }),
        new NonPlayerCharacter({
            sprite: sprites.smith,
            behaviour:new Behaviour(decisionFunctions.moveBackAndForward),
            vantage: new Vantage({ x: 6.25, y: 6.25, direction: Direction.west }),
            talkMessage: "Wanna buy a hammer?",
            name: "Roger the smith",
        }),

        new NonPlayerCharacter({
            sprite: sprites.fighterSprite,
            vantage: new Vantage({ x: 4.75, y: 5.75, direction: Direction.north }),
            talkMessage: "They aren't offering enough money for me to fight any monsters.",
            name: "Harry Longblade",
        }),

        new NonPlayerCharacter({
            sprite: sprites.guardSprite,
            vantage: new Vantage({ x: 5.25, y: 7.25, direction: Direction.north }),
            talkMessage: "Abide by the laws and we won't have any trouble.",
            name: "Corporal Mack",
            behaviour:new Behaviour(decisionFunctions.moveBackAndForward),
        }),

        new NonPlayerCharacter({
            sprite: sprites.guardSprite,
            vantage: new Vantage({ x: 4.5, y: 3.5, direction: Direction.south }),
            talkMessage: "I'm just a guard.",
            name: "Corporal Colin",
        }),

        new NonPlayerCharacter({
            sprite: sprites.redMonk,
            vantage: new Vantage({x:3.5,y:0.5,direction:Direction.south}),
            name: "Father Dunlaw",
            talkMessage: "I have a quest for you!",
        }),
        new NonPlayerCharacter({
            sprite: sprites.innKeeper,
            vantage: new Vantage({x:6.5,y:2.25,direction:Direction.south}),
            name: "Widow Elsa",
            talkMessage: "No rooms for the likes of you!",
        }),

    ],

    controllers: [

        new Controller({ inputs: [keyhole], subject: door3, statusChangeOnInputTrigger: "OPEN" }),
    ]
}).withWallsAround({color:Color.GREEN, shape:spikey})



export { level1 }