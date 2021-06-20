import { PlotPlace, ConvertFunction, plotPolygon, Point, mapPointInSight } from "@/canvas/canvas-utility";
import { scaleTo } from "@/canvas/manipulations";
import { Sprite } from "@/game-classes/Sprite";
import { Color } from "./Color";
import { Direction } from "./Direction";
import { Position } from "./Position";
import { RelativeDirection } from "./RelativeDirection";
import { WallFeature } from "./WallFeature";



interface WallConfig {
    x: number
    y: number
    place: Direction
    color?: Color
    patternSprite?: Sprite
    features?: WallFeature[]
    shape?: Point[]
    open?: boolean
}

class Wall extends Position {
    data: WallConfig

    constructor(config: WallConfig) {
        super(config)
        this.data = config
        this.data.features = this.data.features || [];
        this.data.open = !!this.data.open
    }


    get isBlocking(): boolean {
        const { open, features = [] } = this.data;
        return !open || !!features.find(feature => feature.isBlocking);
    }

    get hasInteractableFeature(): boolean {
        const { features = [] } = this.data;
        return !!features.find(feature => feature.canInteract);
    }

    isFacing(direction: Direction): boolean {
        return this.data.place.x === direction.x && this.data.place.y === direction.y
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, plotPlace: PlotPlace, tickCount: number, defaultSprite?: Sprite): void {

        const { place, relativeDirection = RelativeDirection.BACK } = plotPlace
        const { patternSprite = defaultSprite, features = [] } = this.data
        const points: Point[] = relativeDirection ? getMappedPoints(relativeDirection, this.data.shape || Wall.defaultShape, place) : [];
        const fullWallPoints = getMappedPoints(relativeDirection, Wall.defaultShape, place)

        ctx.fillStyle = getColorFill(relativeDirection, this.data.color || Wall.defaultColor)

        if (patternSprite) {
            ctx.fillStyle = getPatternFill(patternSprite, Sprite.defaultWallAnimation, fullWallPoints, relativeDirection) || ctx.fillStyle
        }
        plotPolygon(ctx, convertFunction, points)

        features.forEach(feature => {
            // to do - delegate to WallFeature.drawInSight, 
            // have feature property decide if it should be rendered over fullWallPoints or points
            const featureImage = getPatternFill(feature.data.sprite, feature.data.animation, fullWallPoints, relativeDirection);
            if (featureImage) {
                ctx.fillStyle = featureImage
                plotPolygon(ctx, convertFunction, fullWallPoints, { noStroke: true })
            }
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

        function getPatternFill(sprite: Sprite, animationName: string, fullWallPoints: Point[], relativeDirection: RelativeDirection = RelativeDirection.BACK): CanvasPattern | null {
            const xValues = fullWallPoints.map(point => point.x);
            const yValues = fullWallPoints.map(point => point.y);

            const topLeft = convertFunction({ x: Math.min(...xValues), y: Math.min(...yValues) })

            const convertedDimensions = convertFunction({
                x: Math.max(...xValues) - Math.min(...xValues),
                y: Math.max(...yValues) - Math.min(...yValues),
            })

            try {
                let image = sprite.provideImage(animationName, getWallFacingDirection(relativeDirection), tickCount)
                image = scaleTo(image, convertedDimensions[0], convertedDimensions[1]);
                const pattern = ctx.createPattern(image, "no-repeat")

                if (self.DOMMatrix && pattern) {
                    const matrix = new DOMMatrix();
                    matrix.translateSelf(...topLeft)
                    pattern.setTransform(matrix)
                }
                return pattern

            } catch (error) {
                console.warn(error.message)
                return null
            }
        }

        function getWallFacingDirection(relativeDirection: RelativeDirection = RelativeDirection.BACK): RelativeDirection {
            return relativeDirection.name == "BACK" || relativeDirection.name == "FORWARD"
                ? RelativeDirection.FORWARD
                : place.right > 0
                    ? RelativeDirection.RIGHT
                    : place.right < 0
                        ? RelativeDirection.LEFT
                        : relativeDirection;
        }
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const convert = (point: Point): [number, number] => [point.x * gridSize, point.y * gridSize];

        const { place, features = [] } = this.data;
        const squareCenter: Point = {
            x: (this.data.x + .5),
            y: (this.data.y + .5)
        }

        const featureToDraw = features.find(feature => feature.isDrawnInMap);
        if (!featureToDraw) {
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
        } else {
            featureToDraw.drawInMap(place, squareCenter).forEach(polygon => {
                plotPolygon(ctx, convert, polygon, { noClose: true, noFill: true })
            })
        }
    }

    static get defaultColor(): Color { return new Color(250, 250, 250, 1) }

    static get defaultShape(): Point[] {
        return [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
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