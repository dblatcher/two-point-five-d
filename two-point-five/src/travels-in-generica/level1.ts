import { Color } from "@/canvas/Color";
import { AbstractFeature } from "@/game-classes/AbstractFeature";
import { putWallsAroundLevel } from "@/game-classes/constructionHelpers";
import { Direction } from "@/game-classes/Direction";
import { Door, InteractableWallFeature } from "@/game-classes/WallFeature";
import { sprites as sharedSprites } from "@/instances/sprites";
import { doorway, spikey } from "@/instances/wallShapes";
import * as globalFeatures from "@/travels-in-generica/features";
import { makeChurch } from "./buildings/church";
import { makeHut } from "./buildings/hut";
import { itemTypes } from "./itemTypes";
import { sprites } from "./sprites";



const features: { [index: string]: AbstractFeature } = {
    ...globalFeatures,
    door3: new Door({ spriteId: sharedSprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false }),
    keyhole: new InteractableWallFeature({ spriteId: sharedSprites.keyHole.id, requiresItem: itemTypes.key, consumesItem: false, onBothSides: true }),
}

const church = makeChurch(0, 0)
const hut1 = makeHut(6, 0, Direction.south, sprites.grayWoodWallOne)
const hut2 = makeHut(9, 6, Direction.north, sprites.brownWoodWallOne)
const hut3 = makeHut(1, 6, Direction.east, sprites.yellowWoodWallOne)
const hut4 = makeHut(6, 8, Direction.north, sprites.grayWoodWallOne)
const hut5 = makeHut(10, 3, Direction.west, sprites.yellowWoodWallOne)
const hut6 = makeHut(13, 7, Direction.west, sprites.brownWoodWallOne)

church.walls[0].featureIds = ["staircaseAdown"]
hut3.walls[0].featureIds = ["torch"]



const level1 = putWallsAroundLevel({
    id: 'level1',
    height: 10, width: 15,
    startingVantage: { x: 3, y: 7, direction: 'NORTH' },
    sky: {
        skyBaseColor: [140, 150, 250],
        sun: true,
    },
    features,
    walls: [
        ...church.walls,
        ({ x: 2, y: 2, placeName: 'NORTH', patternSprite: sharedSprites.brickWall.id, shape: doorway, featureIds: ["door3", "keyhole"], open: true }),
        ...hut1.walls,
        ...hut2.walls,
        ...hut3.walls,
        ...hut4.walls,
        ...hut5.walls,
        ...hut6.walls,

        ({ x: 3, y: 15, placeName: 'SOUTH', shape: spikey, color: Color.GREEN.serialise() }),
        ({ x: 4, y: 15, placeName: 'SOUTH', shape: spikey, color: Color.GREEN.serialise() }),
        ({ x: 5, y: 15, placeName: 'SOUTH', shape: spikey, color: Color.GREEN.serialise() }),

        ({ x: 5, y: 12, placeName: 'SOUTH', shape: spikey, color: Color.GREEN.serialise() }),
        ({ x: 6, y: 12, placeName: 'SOUTH', shape: spikey, color: Color.GREEN.serialise() }),
        ({ x: 7, y: 12, placeName: 'SOUTH', shape: spikey, color: Color.GREEN.serialise() }),

    ],

    staticFigures: [
        { x: 4, y: 7, direction: 'SOUTH', spriteId: sprites.treeOne.id },
    ],

    squaresWithFeatures: [
        ...church.ceilings,
        ...hut1.ceilings,
        ...hut2.ceilings,
        ...hut3.ceilings,
        ...hut4.ceilings,
        ...hut5.ceilings,
        ...hut6.ceilings,
    ],

    items: [
        {
            type: itemTypes.bardHat.id,
            vantage: { x: 8.2, y: 6.2, direction: 'NORTH' }
        },
        {
            type: itemTypes.bean.id,
            vantage: { x: 5.5, y: 4.5, direction: 'NORTH' }
        },
    ],

    actors: [
        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.smith.data.id,
            vantage: ({ x: 1.5, y: 7.5, direction: 'EAST' }),
            talkMessage: "Wanna buy a hammer?",
            name: "George the blacksmith",
        }),
        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.farmer2.data.id,
            behaviour: ('wanderAround'),
            vantage: ({ x: 8.25, y: 4.25, direction: 'NORTH' }),
            talkMessage: "I am taking my turnips to the market.",
            name: "John the farmer",
        }),
        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.farmer.data.id,
            behaviour: ('walkInCircle'),
            vantage: ({ x: 6.25, y: 6.25, direction: 'WEST' }),
            talkMessage: "I should get back to the cows.",
            name: "Roger the herdsman",
        }),

        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.armedMan.data.id,
            vantage: ({ x: 10.75, y: 5.75, direction: 'NORTH' }),
            talkMessage: "They aren't offering enough money for me to fight any monsters.",
            name: "Harry Longblade",
        }),

        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.guard2.data.id,
            vantage: ({ x: 5.25, y: 7.25, direction: 'NORTH' }),
            talkMessage: "Abide by the laws and we won't have any trouble.",
            name: "Corporal Mack",
            behaviour: ('moveBackAndForward'),
        }),

        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.guard3.data.id,
            vantage: ({ x: 4.5, y: 3.5, direction: 'SOUTH' }),
            talkMessage: "I'm just a guard.",
            name: "Corporal Colin",
            questHooks: [
                ({
                    questId: "questOne",
                    action: "GIVE",
                    message: "Old Father Dunlaw in there messed up the last rites on dead wizard and now the crypt is full of skeletons. Can you smash them up for him?",
                    acceptMessage: "Great. This is key to the crypt, just go into the chapel and down the stair. Speak to Father Dunlaw when you're done.",
                    refuseMessage: "Whatever... I'm not going down there.",
                }),
            ]
        }),

        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.redMonk.data.id,
            vantage: ({ x: 3.5, y: 0.5, direction: 'SOUTH' }),
            name: "Father Dunlaw",
            talkMessage: "Welcome to Saint Bernard's Chapel.",
            questHooks: [
                ({
                    questId: "questOne",
                    action: "GIVE",
                    message: "The dead have risen in the church crypt. Rather embarassing, actually. Please put them to rest by smashing their bones.",
                    acceptMessage: "Thank you - here is the key to the crypt. The stairs down are behind the door over there.",
                    refuseMessage: "Oh well... maybe someone braver will come along. hopefully before the bishop's inspection.",
                }),
                ({
                    questId: "questOne",
                    action: "REMIND",
                    message: "How are you getting on in the crypt?"
                }),
                ({
                    questId: "questOne",
                    action: "REWARD",
                    message: "Bless you, my children. Now the dead can sleep easy again... as can I."
                }),
            ]
        }),
        ({
            actorType: 'NonPlayerCharacter',
            sprite: sprites.innKeeper.data.id,
            vantage: ({ x: 6.5, y: 2.25, direction: 'SOUTH' }),
            name: "Widow Elsa",
            talkMessage: "No rooms for the likes of you!",
        }),

    ],

    controllers: [
        { inputIds: ["keyhole"], subjectId: "door3", statusChangeOnInputTrigger: "OPEN" },
    ]
}, { patternSprite: sprites.fence, })



export { level1 };

