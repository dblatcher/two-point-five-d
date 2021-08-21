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

const vaultDoorway: Point[] = [
    { x: 0, y: 1 },
    { x: .5, y: 1.25 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: .9, y: 0 },
    { x: .9, y: .9 },
    { x: .1, y: .9 },
    { x: .1, y: .0 },
    { x: 0, y: .0 },
]

const spikey: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: .2 },
    { x: .2, y: .5 },
    { x: .4, y: .2 },
    { x: .6, y: .5 },
    { x: .8, y: .2 },
    { x: 1, y: .5 },
    { x: 1, y: 0 },
]

const tower: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 1, y: 0 },
]

const towerUpper: Point[] = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 1, y: 1 },
]

export { lowWall, doorway, spikey, tower, vaultDoorway, towerUpper }