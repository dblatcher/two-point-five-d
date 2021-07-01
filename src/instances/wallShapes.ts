import { Point } from "@/canvas/canvas-utility";

const lowWall: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: .5 },
    { x: .25, y: .5 },
    { x: .35, y: .5 },
    { x: .35, y: .25 },
    { x: .65, y: .25 },
    { x: .65, y: .5 },
    { x: .75, y: .5 },
    { x: 1, y: .5 },
    { x: 1, y: 0 },
]

const doorway: Point[] = [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: .9, y: 0 },
    { x: .9, y: .9 },
    { x: .1, y: .9 },
    { x: .1, y: .0 },
    { x: 0, y: .0 },
]


export {lowWall, doorway}