import { Color } from "@/canvas/Color"
import { TextBoard } from "@/canvas/TextBoard"
import { FloorFeature, Pit } from "@/game-classes/FloorFeature"
import { Door, WallFeature, WallSwitch } from "@/game-classes/WallFeature"
import { sprites } from "@/instances/sprites"

function makeSign(text: string[]): WallFeature {
    return new WallFeature({
        clipToWall: true,
        textBoard: new TextBoard({
            content: text,
            size: { x: .8, y: .5 },
            textScale: 3.5,
            font: 'arial',
            textColor: Color.BLUE,
            backgroundColor: Color.YELLOW,
        }),
    })
}

const lever1 = new WallSwitch({ sprite: sprites.leverSprite, })
const door1 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })
const door2 = new Door({ sprite: sprites.doorSprite, status: 'CLOSED', canOpenDirectly: false })


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

export {makeSign, lever1, door1, door2, floorSwitch, floorSwitch2, pit1, pitClosed}