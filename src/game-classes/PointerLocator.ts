import { mapPointInSight, Point } from "@/canvas/canvas-utility";

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
    }

    locate(clickInfo: Point, isWallInFace: boolean): ZonePoint | null {
        if (!isWallInFace) {
            return this.locateOnBackWallOrFloor(clickInfo);
        } else {
            return this.locateOnFrontWall(clickInfo);
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
                left: mapPointInSight(-.5 + clickDepthOnFloor, -.5, 0),
                right: mapPointInSight(-.5 + clickDepthOnFloor, .5, 0)
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

}

export { PointerLocator }