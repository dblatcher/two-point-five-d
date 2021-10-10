import { ConvertFunction, plotPolygon, Point, mapPointInSight } from "@/canvas/canvas-utility";
import { getPatternFill, getUpperLevelPatternFill } from "@/canvas/patterns";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { Sprite } from "@/canvas/Sprite";
import { Color } from "../canvas/Color";
import { Direction } from "./Direction";
import { Level } from "./Level";
import { Position } from "./Position";
import { RelativeDirection } from "./RelativeDirection";
import { Vantage } from "./Vantage";
import { WallFeature } from "./WallFeature";



interface WallConfig {
    x: number
    y: number
    place: Direction
    color?: Color
    patternSprite?: Sprite
    shape?: Point[]
    features?: WallFeature[]
    open?: boolean
    featureIds?: string[]
}

class Wall extends Position {
    data: WallConfig
    level?: Level

    constructor(config: WallConfig) {
        super(config)
        this.data = config
        this.data.features = this.data.features || [];
        this.data.open = !!this.data.open
    }


    get isBlocking(): boolean {
        const { open } = this.data;
        const features = this.getFeatures()
        return !open || !!features.find(feature => feature.isBlocking);
    }

    get hasInteractableFeature(): boolean {
        const { features = [] } = this.data;
        return !!features.find(feature => feature.canInteract);
    }

    get hasBlockingFeature(): boolean {
        const { features = [] } = this.data;
        return !!features.find(feature => feature.isBlocking);
    }

    isFacing(direction: Direction): boolean {
        return this.data.place.x === direction.x && this.data.place.y === direction.y
    }

    reverseSideShowingfrom(vantage: Vantage): boolean {

        const relativeDirection = this.data.place.relativeDirection(vantage.data.direction)
        // wall relative direction is which edge of the square it makes up, not the direction it faces

        const rightOfVantage = vantage.data.direction.rightOf;

        const stepsRight = rightOfVantage.y
            ? (this.gridY - vantage.gridY) * rightOfVantage.y
            : (this.gridX - vantage.gridX) * rightOfVantage.x

        if (relativeDirection.r == 0) {
            return this.data.place.name != vantage.data.direction.name
        } else {
            if (relativeDirection.r == 1 && stepsRight >= 0) { return false }
            else if (relativeDirection.r == -1 && stepsRight <= 0) { return false }
            else { return true }
        }
    }

    getFeatures(): WallFeature[] {

        const { features: directlyReferencedFeatures = [], featureIds = [] } = this.data
        const allFeatures = [...directlyReferencedFeatures]

        if (this.level) {
            const featuresFromKeys = WallFeature.getFeatureFromKeyString(featureIds, WallFeature, this.level) as WallFeature[];
            allFeatures.push(...featuresFromKeys)
        }
        return allFeatures
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number, defaultSprite?: Sprite): void {

        const { place, relativeDirection = RelativeDirection.BACK, isReverseOfWall } = renderInstruction
        const { patternSprite = defaultSprite, shape = Wall.defaultShape } = this.data
        const wallShapePoints = getMappedPoints(relativeDirection, shape, place);
        const fullWallPoints = getMappedPoints(relativeDirection, Wall.defaultShape, place);

        let fillStyle: CanvasPattern | string = getColorFill(relativeDirection, this.data.color || Wall.defaultColor)

        const features = this.getFeatures()

        const isDoubleHeight = shape.some(point => point.y > 1);
        if (patternSprite && isDoubleHeight) {
            const mappedUpperLevel = getMappedPoints(relativeDirection, Wall.upperLevel, place);
            const upperLevelFillStyle = getUpperLevelPatternFill(ctx, convertFunction, renderInstruction, tickCount, patternSprite, Sprite.defaultWallAnimation, mappedUpperLevel, undefined, "no-repeat") || fillStyle

            const topHalfShape = shape.map(point => {
                return { x: point.x, y: Math.max(1, point.y) }
            })

            const mappedTopHalfShape = getMappedPoints(relativeDirection, topHalfShape, place)
            plotPolygon(ctx, convertFunction, mappedTopHalfShape, { strokeStyle: 'transparent', fillStyle: upperLevelFillStyle })
        }

        if (patternSprite) {
            fillStyle = getPatternFill(ctx, convertFunction, renderInstruction, tickCount, patternSprite, Sprite.defaultWallAnimation, fullWallPoints, undefined, "no-repeat") || fillStyle
        }

        plotPolygon(ctx, convertFunction, wallShapePoints, { strokeStyle: fillStyle, fillStyle })


        features.forEach(feature => {
            if (isReverseOfWall && !feature.data.onBothSides) { return }
            feature.drawInSight(ctx, convertFunction, renderInstruction, tickCount, fullWallPoints, wallShapePoints)
        })


        function getMappedPoints(relativeDirection: RelativeDirection = RelativeDirection.BACK, shape: Point[], place: { forward: number, right: number }): Point[] {
            switch (relativeDirection) {
                case RelativeDirection.LEFT:
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5 - point.x, place.right - .5, point.y)
                    })
                case RelativeDirection.RIGHT:
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5 - point.x, place.right + .5, point.y)
                    })
                case RelativeDirection.FORWARD:
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5, place.right - .5 + point.x, point.y)
                    })
                default:
                case RelativeDirection.BACK:
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5 - 1, place.right - .5 + point.x, point.y)
                    })
            }
        }

        function getColorFill(relativeDirection: RelativeDirection = RelativeDirection.BACK, baseColor: Color): string {
            switch (relativeDirection) {
                case RelativeDirection.LEFT:
                case RelativeDirection.RIGHT:
                    return baseColor.darker(12 * (place.forward + .5)).css
                case RelativeDirection.FORWARD:
                    return baseColor.darker(12 * (place.forward + 1)).css
                default:
                case RelativeDirection.BACK:
                    return baseColor.darker(12 * place.forward).css
            }
        }

    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {

        const { place } = this.data;
        const features = this.getFeatures();
        const featureToDraw = features.find(feature => feature.isDrawnInMap);

        if (featureToDraw) {
            featureToDraw.drawInMap(ctx, gridSize, this, this.data.place)
        } else {

            const convert: ConvertFunction = (point: Point): [number, number] => [point.x * gridSize, point.y * gridSize];
            const squareCenter: Point = {
                x: (this.gridX + .5),
                y: (this.gridY + .5)
            }

            const edge = place.translatePoint(squareCenter, .5);
            const leftCorner = place.leftOf.translatePoint(edge, .5);
            const rightCorner = place.rightOf.translatePoint(edge, .5);
            const leftMiddle = place.leftOf.translatePoint(edge, .25);
            const rightMiddle = place.rightOf.translatePoint(edge, .25);
            if (this.isBlocking) {
                plotPolygon(ctx, convert, [leftCorner, rightCorner], { noClose: true, noFill: true })
            } else {
                plotPolygon(ctx, convert, [leftCorner, leftMiddle], { noClose: true, noFill: true })
                plotPolygon(ctx, convert, [rightCorner, rightMiddle], { noClose: true, noFill: true })
            }
        }
    }

    static get defaultColor(): Color { return Color.GRAY }

    static get defaultShape(): Point[] {
        return [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
        ]
    }
    static get upperLevel(): Point[] {
        return [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
        ]
    }

    static get baseHeight(): number {
        return .8
    }

    static get baseWidth(): number {
        return .6
    }
}


export { Wall, WallConfig }