import { Color } from "@/canvas/Color"
import { FloorFeatureInput, PitInput } from "@/game-classes/FloorFeature"
import { DoorInput, WallFeatureInput, WallSwitchInput } from "@/game-classes/WallFeature"
import { sprites } from "@/instances/sprites"

function makeSign(text: string[]): WallFeatureInput {
    return {
        featureType: 'WallFeature',
        clipToWall: true,
        textBoard: {
            content: text,
            size: { x: .8, y: .5 },
            textScale: 3.5,
            font: 'arial',
            textColor: Color.BLUE.serialise(),
            backgroundColor: Color.YELLOW.serialise(),
        },
    }
}

const lever1: WallSwitchInput = { featureType: 'WallSwitch', spriteId: sprites.leverSprite.id, }
const door1: DoorInput = ({ featureType: 'Door', fillColor: 'yellow', status: 'CLOSED', canOpenDirectly: false })
const door2: DoorInput = ({ featureType: 'Door', fillColor: 'yellow', status: 'CLOSED', canOpenDirectly: false })


const bigSquareOnFloor: [number, number][] = [
    [-.4, -.4], [.4, -.4], [.4, .4], [-.4, .4]
]



const floorSwitch: FloorFeatureInput = ({
    featureType: 'FloorFeature',
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'gray' }, shape: bigSquareOnFloor
})
const floorSwitch2: FloorFeatureInput = ({
    featureType: 'FloorFeature',
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'gray' }, shape: bigSquareOnFloor
})

const pit1: PitInput = ({ featureType: 'Pit', status: "OPEN" })
const pitClosed: PitInput = ({ featureType: 'Pit', status: "CLOSED" })

const shapeOnWall: WallFeatureInput = {
    featureType: 'WallFeature',
    shapes: [
        {
            plotConfig: { fillStyle: 'pink' },
            shape: [
                [0, 0],
                [1, 0],
                [0, 1],
            ]
        }
    ]
}

export { door1, door2, floorSwitch, floorSwitch2, lever1, makeSign, pit1, pitClosed, shapeOnWall }

