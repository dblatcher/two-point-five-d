import { mapPointInSight, mapPointOnCeiling, mapPointOnFloor, Point } from "@/canvas/canvas-utility";
import { Direction } from "./Direction";
import { Item } from "./Item";
import { Position } from "./Position";
import { Vantage } from "./Vantage";
import { Wall } from "./Wall";
import { WallFeature } from "./WallFeature";

interface ZonePoint {
    zone: string | undefined
    x: number
    y: number
}

class PointerLocator {
    floor: {
        backLeft: Point
        forwardLeft: Point
        forwardRight: Point
        backRight: Point
    }

    backWall: {
        bottomLeft: Point
        topLeft: Point
        topRight: Point
        bottomRight: Point
    }

    frontWall: {
        bottomLeft: Point
        topLeft: Point
        topRight: Point
        bottomRight: Point
    }

    leftWall: {
        backTop: Point
        forwardTop: Point
        forwardBottom: Point
        backBottom: Point
    }

    rightWall: {
        backTop: Point
        forwardTop: Point
        forwardBottom: Point
        backBottom: Point
    }

    constructor() {
        this.floor = {
            backLeft: mapPointInSight(-.5, -.5, 0),
            forwardLeft: mapPointInSight(.5, -.5, 0),
            forwardRight: mapPointInSight(.5, .5, 0),
            backRight: mapPointInSight(-.5, .5, 0),
        }

        this.backWall = {
            bottomLeft: mapPointInSight(.5, -.5, 0),
            topLeft: mapPointInSight(.5, -.5, 1),
            topRight: mapPointInSight(.5, .5, 1),
            bottomRight: mapPointInSight(.5, .5, 0),
        }

        this.frontWall = {
            bottomLeft: mapPointInSight(-.5, -.5, 0),
            topLeft: mapPointInSight(-.5, -.5, 1),
            topRight: mapPointInSight(-.5, .5, 1),
            bottomRight: mapPointInSight(-.5, .5, 0),
        }

        this.leftWall = {
            forwardTop: this.frontWall.topLeft,
            backTop: mapPointInSight(-1.5, -.5, 1),
            backBottom: mapPointInSight(-1.5, -.5, 0),
            forwardBottom: this.frontWall.bottomLeft,
        }

        this.rightWall = {
            forwardTop: this.frontWall.topRight,
            backTop: mapPointInSight(-1.5, .5, 1),
            backBottom: mapPointInSight(-1.5, .5, 0),
            forwardBottom: this.frontWall.bottomRight,
        }
    }

    locate(clickInfo: Point, isWallInFace: boolean): ZonePoint | null {
        if (!isWallInFace) {
            return this.locateOnSideWalls(clickInfo) || this.locateOnBackWallOrFloor(clickInfo);
        } else {
            return this.locateOnSideWalls(clickInfo) || this.locateOnFrontWall(clickInfo);
        }

    }

    locateOnFrontWall(clickInfo: Point): ZonePoint | null {
        const { frontWall } = this;

        const withinFrontWall
            = clickInfo.y >= frontWall.topLeft.y
            && clickInfo.y <= frontWall.bottomLeft.y
            && clickInfo.x >= frontWall.bottomLeft.x
            && clickInfo.x <= frontWall.bottomRight.x;

        if (withinFrontWall) {
            const yInWall = (clickInfo.y - frontWall.topLeft.y) / (frontWall.bottomLeft.y - frontWall.topLeft.y);
            const xInWall = (clickInfo.x - frontWall.topLeft.x) / (frontWall.topRight.x - frontWall.topLeft.x);

            return { zone: "FRONT_WALL", x: xInWall, y: yInWall }
        }

        return null
    }

    locateOnBackWallOrFloor(clickInfo: Point): ZonePoint | null {

        const { floor, backWall } = this
        const atFloorLevel = clickInfo.y <= floor.backLeft.y && clickInfo.y >= floor.forwardLeft.y;

        if (atFloorLevel) {
            const yInFloor = clickInfo.y - floor.forwardLeft.y
            const clickDepthOnFloor = 1 - (yInFloor / (this.floor.backLeft.y - this.floor.forwardLeft.y))

            const floorEdgesAtDepth = {
                left: mapPointOnFloor(-.5 + clickDepthOnFloor, -.5),
                right: mapPointOnFloor(-.5 + clickDepthOnFloor, .5)
            }

            const xInfloor = clickInfo.x - floorEdgesAtDepth.left.x;
            const clickWidthOnFloor = xInfloor / (floorEdgesAtDepth.right.x - floorEdgesAtDepth.left.x)

            if (clickWidthOnFloor <= 1 || clickWidthOnFloor >= 0) {
                return { zone: "FLOOR", x: clickWidthOnFloor, y: clickDepthOnFloor }
            }
        }

        const withinBackWall
            = clickInfo.y >= backWall.topLeft.y
            && clickInfo.y <= backWall.bottomLeft.y
            && clickInfo.x >= backWall.bottomLeft.x
            && clickInfo.x <= backWall.bottomRight.x;

        if (withinBackWall) {
            const yInWall = (clickInfo.y - backWall.topLeft.y) / (backWall.bottomLeft.y - backWall.topLeft.y);
            const xInWall = (clickInfo.x - backWall.topLeft.x) / (backWall.topRight.x - backWall.topLeft.x);

            return { zone: "BACK_WALL", x: xInWall, y: yInWall }
        }

        return null
    }

    locateOnSideWalls(clickInfo: Point): ZonePoint | null {
        const { leftWall, rightWall } = this;

        if (clickInfo.x <= leftWall.forwardTop.x) {
            const xInWall = clickInfo.x - leftWall.forwardTop.x
            const clickDepthOnWall = (xInWall / (this.leftWall.forwardTop.x - leftWall.backTop.x)) + 1

            const wallEdgesAtDepth = {
                top: mapPointOnCeiling(-1.5 + clickDepthOnWall, -.5),
                bottom: mapPointOnFloor(-1.5 + clickDepthOnWall, -.5),
            }

            const yInfloor = clickInfo.y - wallEdgesAtDepth.top.y;
            const clickHeightOnWall = yInfloor / (wallEdgesAtDepth.bottom.y - wallEdgesAtDepth.top.y)

            if (clickHeightOnWall <= 1 && clickHeightOnWall >= 0 && clickDepthOnWall <= 1 && clickDepthOnWall >= 0) {
                return { zone: "LEFT_WALL", x: clickDepthOnWall, y: clickHeightOnWall }
            }
        }

        if (clickInfo.x >= rightWall.forwardTop.x) {
            const xInWall = clickInfo.x - rightWall.forwardTop.x
            const clickDepthOnWall = -(xInWall / (this.rightWall.forwardTop.x - rightWall.backTop.x))

            const wallEdgesAtDepth = {
                top: mapPointOnCeiling(-.5 - clickDepthOnWall, .5),
                bottom: mapPointOnFloor(-.5 - clickDepthOnWall, .5),
            }

            const yInfloor = clickInfo.y - wallEdgesAtDepth.top.y;
            const clickHeightOnWall = yInfloor / (wallEdgesAtDepth.bottom.y - wallEdgesAtDepth.top.y)

            if (clickHeightOnWall <= 1 && clickHeightOnWall >= 0 && clickDepthOnWall <= 1 && clickDepthOnWall >= 0) {
                return { zone: "RIGHT_WALL", x: clickDepthOnWall, y: clickHeightOnWall }
            }
        }

        return null
    }

    identifyClickedFeature(zonePoint: ZonePoint, wall: Wall): WallFeature | null {
        const { features = [] } = wall.data;
        return features.find(feature => {
            const { offset = { x: .5, y: .5 }, size = { x: 1, y: 1 } } = feature.data.sprite;
            const clickIsWithinBounds = Math.abs((zonePoint.x - offset.x) / (size.x / 2)) <= 1 &&
                Math.abs((zonePoint.y - offset.y) / (size.y / 2)) <= 1
            return clickIsWithinBounds;
        }) || null
    }

    identifyPointOnFloorSquare(zonePoint: ZonePoint, facingDirection: Direction): Point {
        let x = .5
        let y = .5;
        if (facingDirection.name === 'NORTH') {
            x = zonePoint.x;
            y = 1 - zonePoint.y;
        } else if (facingDirection.name === 'WEST') {
            x = 1 - zonePoint.y;
            y = 1 - zonePoint.x;
        } else if (facingDirection.name === 'EAST') {
            x = zonePoint.y;
            y = zonePoint.x;
        } else if (facingDirection.name === 'SOUTH') {
            x = 1 - zonePoint.x;
            y = zonePoint.y;
        }

        return { x, y }
    }

    identifyClickedItemOnFloor(playerCharacter: Vantage, items: Item[], clickInfo: Point, canReachSquareAhead = false): Item | null {
        const squareIn = new Position(playerCharacter.data);
        const itemsInSquareIn = items.filter(item => item.data.vantage && item.data.vantage.isInSameSquareAs(squareIn))
        const squareAhead = squareIn.translate(playerCharacter.data.direction)
        const itemsInSquareAhead = items.filter(item => item.data.vantage && item.data.vantage.isInSameSquareAs(squareAhead))

        if (!canReachSquareAhead) {
            return identifyClickedItemInSquare(playerCharacter.data.direction, itemsInSquareIn, clickInfo, 0)
        }

        return identifyClickedItemInSquare(playerCharacter.data.direction, itemsInSquareIn, clickInfo, 0) ||
            identifyClickedItemInSquare(playerCharacter.data.direction, itemsInSquareAhead, clickInfo, 1)

        function identifyClickedItemInSquare(viewedFrom: Direction, items: Item[], clickInfo: Point, forward = 0): Item | null {
            return items.find(item => {
                const { figure } = item
                if (!figure) { return false }
                const renderParams = figure.getRenderParams(viewedFrom, forward, 0)
                const inBoundX = clickInfo.x >= renderParams.topLeft.x && clickInfo.x <= renderParams.topRight.x;
                const inBoundY = clickInfo.y >= renderParams.topLeft.y && clickInfo.y <= renderParams.centerOnFloor.y;
                return inBoundX && inBoundY
            }) || null
        }
    }

}

export { PointerLocator }