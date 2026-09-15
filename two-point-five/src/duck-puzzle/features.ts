import { Color } from "@/canvas/Color"
import { FloorFeature, Pit } from "@/game-classes/FloorFeature"
import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature"
import { sprites } from "@/instances/sprites"

function makeSign(text: string[]): WallFeature {
    return new WallFeature({
        clipToWall: true,
        textBoard: {
            content: text,
            size: { x: .8, y: .5 },
            textScale: 3.5,
            font: 'arial',
            textColor: Color.BLUE.serialise(),
            backgroundColor: Color.YELLOW.serialise(),
        },
    })
}

const lever1 = new WallSwitch({ spriteId: sprites.leverSprite.id, })
const door1 = new Door({ spriteId: sprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ spriteId: sprites.doorSprite.id, status: 'CLOSED', canOpenDirectly: false })


const bigSquareOnFloor: [number, number][] = [
    [-.4, -.4], [.4, -.4], [.4, .4], [-.4, .4]
]



const floorSwitch = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'gray' }, shape: bigSquareOnFloor
})
const floorSwitch2 = new FloorFeature({
    blocksByDefault: false,
    plotConfig: { noFill: false, fillStyle: 'gray' }, shape: bigSquareOnFloor
})

const pit1 = new Pit({ status: "OPEN" })
const pitClosed = new Pit({ status: "CLOSED" })

export { door1, door2, floorSwitch, floorSwitch2, lever1, makeSign, pit1, pitClosed }
