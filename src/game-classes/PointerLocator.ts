import { mapPointInSight, mapPointOnCeiling, mapPointOnFloor, Point } from "@/canvas/canvas-utility";
import { Direction } from "./Direction";
import { FigureMap } from "./Game";
import { Item } from "./Item";
import { PlayerVantage } from "./PlayerVantage";
import { Position } from "./Position";
import { Vantage } from "./Vantage";
import { Wall } from "./Wall";
import { WallFeature } from "./WallFeature";

interface ZonePoint {
    zone: string | undefined
    x: number
    y: number
    type: "WALL" | "FLOOR" | "AIR"
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

    locate(clickInfo: Point, isWallInFace: boolean): ZonePoint[] {
        const zonePoints: ZonePoint[] = [];

        const pointInSideWalls = this.locateOnSideWalls(clickInfo)
        if (pointInSideWalls) { zonePoints.push(pointInSideWalls) }

        if (isWallInFace) {
            const pointInFrontWall = this.locateOnFrontWall(clickInfo)
            if (pointInFrontWall) { zonePoints.push(pointInFrontWall) }
        }

        const pointInBackWallOrFloor = this.locateOnBackWallOrFloor(clickInfo)
        if (pointInBackWallOrFloor) { zonePoints.push(pointInBackWallOrFloor) }

        return zonePoints
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

            return { zone: "FRONT_WALL", x: xInWall, y: yInWall, type: "WALL" }
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
                return { zone: "FLOOR", x: clickWidthOnFloor, y: clickDepthOnFloor, type: "FLOOR" }
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

            return { zone: "BACK_WALL", x: xInWall, y: yInWall, type: "AIR" }
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
                return { zone: "LEFT_WALL", x: clickDepthOnWall, y: clickHeightOnWall, type: "WALL" }
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
                return { zone: "RIGHT_WALL", x: clickDepthOnWall, y: clickHeightOnWall, type: "WALL" }
            }
        }

        return null
    }

    identifyClickedWall(zonePoint: ZonePoint, walls: Wall[], observer: Vantage): Wall | undefined {
        let wallClicked: Wall | undefined = undefined;
        if (zonePoint.zone == "FRONT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(observer) && wall.isFacing(observer.data.direction)) ||
                walls.find(wall => wall.isInSameSquareAs(observer.translate(observer.data.direction)) && wall.isFacing(observer.data.direction.behind));
        }

        if (zonePoint.zone == "RIGHT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(observer) && wall.isFacing(observer.data.direction.rightOf)) ||
                walls.find(wall => wall.isInSameSquareAs(observer.translate(observer.data.direction.rightOf)) && wall.isFacing(observer.data.direction.leftOf));
        }

        if (zonePoint.zone == "LEFT_WALL") {
            wallClicked =
                walls.find(wall => wall.isInSameSquareAs(observer) && wall.isFacing(observer.data.direction.leftOf)) ||
                walls.find(wall => wall.isInSameSquareAs(observer.translate(observer.data.direction.leftOf)) && wall.isFacing(observer.data.direction.rightOf));
        }

        return wallClicked;
    }

    identifyClickedFeature(zonePoint: ZonePoint, wall: Wall, isReverseOfWall: boolean): WallFeature | null {
        const { features = [] } = wall.data;
        return features.find(feature => {
            if (isReverseOfWall && !feature.data.onBothSides) { return false }

            const { offset, size } = feature;

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

    identifyClickedFigure(playerVantage: PlayerVantage, figureMaps: FigureMap[], clickInfo: { x: number; y: number; }, canReachSquareAhead = false): FigureMap | null {

        const squareIn = new Position(playerVantage.data);
        const squareAhead = squareIn.translate(playerVantage.data.direction)

        const figureInSquareIn = figureMaps.filter(figureMap => figureMap.figure.isInSameSquareAs(squareIn))
        const figuresSquareAhead = figureMaps.filter(figureMap => figureMap.figure.isInSameSquareAs(squareAhead))

        if (!canReachSquareAhead) {
            return identifyClickedFigureInSquare(playerVantage.data.direction, figureInSquareIn, clickInfo, 0)
        }

        return identifyClickedFigureInSquare(playerVantage.data.direction, figureInSquareIn, clickInfo, 0) ||
            identifyClickedFigureInSquare(playerVantage.data.direction, figuresSquareAhead, clickInfo, 1)

        function identifyClickedFigureInSquare(viewedFrom: Direction, figureMaps: FigureMap[], clickInfo: Point, forward = 0): FigureMap | null {
            return figureMaps.find(figureMap => {
                const { figure } = figureMap
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