import { Color } from "@/canvas/Color";
import { TextBoardInput } from "@/canvas/TextBoard";
import { CeilingFeatureInput } from "@/game-classes/CeilingFeature";
import { makeTwoWayTunnel } from "@/game-classes/Reaction";
import { WallFeatureInput } from "@/game-classes/WallFeature";
import { sprites } from "@/instances/sprites";
import { sprites as mySprites } from "./sprites";


const painting1: WallFeatureInput = ({ featureType: 'WallFeature', spriteId: sprites.paintingWall.id, })
const paintingClipped: WallFeatureInput = ({ featureType: 'WallFeature', spriteId: sprites.paintingWall.id, clipToWall: true })

const poemTextBoard: TextBoardInput = {
    content: [
        "My name is Ozymandias, King of Kings",
        "Look on my Works, ye Mighty, and despair!"
    ],
    size: { x: .8, y: .5 },
    resolution: 1,
    font: 'fantasy',
    textScale: 1.25,
    backgroundColor: [150, 120, 200]
}

const poemBoard: WallFeatureInput = ({
    featureType: 'WallFeature',
    clipToWall: true,
    textBoard: poemTextBoard,
})

const advertBoard: WallFeatureInput = ({
    featureType: 'WallFeature',
    clipToWall: true,
    textBoard: {
        content: [
            "BUY",
            "FISH",
            "HERE",
        ],
        size: { x: .8, y: .5 },
        textScale: 4.5,
    },
})

const [toLevel1OnStaircaseA, toLevel2OnStaircaseA] = makeTwoWayTunnel('upstairs', 'downstairs');
const staircaseAUp: WallFeatureInput = ({
    featureType: 'WallFeature',
    interactable: true,
    spriteId: sprites.stairs.id, reactions: [toLevel1OnStaircaseA]
})
const staircaseAdown: WallFeatureInput = ({
    featureType: 'WallFeature',
    interactable: true,
    spriteId: sprites.stairs.id, reactions: [toLevel2OnStaircaseA]
})


const brownCeiling: CeilingFeatureInput = ({
    featureType: 'CeilingFeature',
    plotConfig: { fillStyle: 'saddlebrown', strokeStyle: 'sandybrown' }
});
const grayCeiling: CeilingFeatureInput = ({
    featureType: 'CeilingFeature',
    plotConfig: { fillStyle: 'gray', strokeStyle: 'gray' }
});
const redCeiling: CeilingFeatureInput = ({
    featureType: 'CeilingFeature',
    plotConfig: { fillStyle: Color.RED.css, strokeStyle: Color.YELLOW.css }
});

const torch: WallFeatureInput = ({
    featureType: 'WallFeature',
    spriteId: mySprites.torch.id,
})

export { advertBoard, brownCeiling, grayCeiling, painting1, paintingClipped, poemBoard, redCeiling, staircaseAdown, staircaseAUp, torch };

