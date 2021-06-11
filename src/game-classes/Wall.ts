import { PlotPlace, ConvertFunction, plotPolygon, Point, mapPointInSight } from "@/canvas/canvas-utility";
import { scaleTo } from "@/canvas/manipulations";
import { Sprite } from "@/game-classes/Sprite";
import { Color } from "./Color";
import { Direction } from "./Direction";
import { Position } from "./Position";
import { WallFeature } from "./WallFeature";



interface WallConfig {
    x: number
    y: number
    place: Direction
    color?: Color
    patternSprite?: Sprite
    features?: WallFeature[]
    shape?: Point[]
}

class Wall extends Position {
    data: WallConfig

    constructor(config: WallConfig) {
        super(config)
        this.data = config
        this.data.features = this.data.features || [];
    }


    isFacing(direction: Direction): boolean {
        return this.data.place.x === direction.x && this.data.place.y === direction.y
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, plotPlace: PlotPlace, tickCount: number, defaultSprite?: Sprite): void {

        const { place, relativeDirection } = plotPlace
        const { patternSprite = defaultSprite, features = [] } = this.data
        const points: Point[] = relativeDirection ? getMappedPoints(relativeDirection, this.data.shape || Wall.defaultShape, place) : [];
        const fullWallPoints = getMappedPoints(relativeDirection, Wall.defaultShape, place)

        ctx.fillStyle = getColorFill(relativeDirection, this.data.color || Wall.defaultColor)

        if (patternSprite) {
            ctx.fillStyle = getPatternFill(patternSprite, Sprite.defaultWallAnimation, fullWallPoints, relativeDirection) || ctx.fillStyle
        }
        plotPolygon(ctx, convertFunction, points)

        features.forEach(feature => {
            const featureImage = getPatternFill(feature.data.sprite, feature.data.animation, fullWallPoints, relativeDirection);
            if (featureImage) {
                ctx.fillStyle = featureImage
                plotPolygon(ctx, convertFunction, fullWallPoints)
            }
        })

        function getMappedPoints(relativeDirection: "LEFT" | "RIGHT" | "FORWARD" | "BACK" = "BACK", shape: Point[], place: { forward: number, right: number }) {
            switch (relativeDirection) {
                case "LEFT":
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5 - point.x, place.right - .5, point.y)
                    })
                case "RIGHT":
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5 - point.x, place.right + .5, point.y)
                    })
                case "FORWARD":
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5, place.right - .5 + point.x, point.y)
                    })
                case "BACK":
                    return shape.map(point => {
                        return mapPointInSight(place.forward - .5 - 1, place.right - .5 + point.x, point.y)
                    })
            }
        }

        function getColorFill(relativeDirection: "LEFT" | "RIGHT" | "FORWARD" | "BACK" = "BACK", baseColor: Color): string {
            switch (relativeDirection) {
                case "LEFT":
                case "RIGHT":
                    return baseColor.darker(12 * (place.forward + .5)).css
                case "FORWARD":
                    return baseColor.darker(12 * (place.forward + 1)).css
                case "BACK":
                    return baseColor.darker(12 * place.forward).css
            }
        }

        function getPatternFill(sprite: Sprite, animationName: string, fullWallPoints: Point[], relativeDirection: "LEFT" | "RIGHT" | "FORWARD" | "BACK" = "BACK"): CanvasPattern | null {
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

        function getWallFacingDirection(relativeDirection: "LEFT" | "RIGHT" | "FORWARD" | "BACK" = "BACK") {
            return relativeDirection == 'BACK' || relativeDirection == 'FORWARD'
                ? 'FORWARD'
                : place.right > 0
                    ? "RIGHT"
                    : place.right < 0
                        ? "LEFT"
                        : relativeDirection;
        }
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        let startX: number, startY: number, endX: number, endY: number;

        startX = endX = this.data.x * gridSize;
        startY = endY = this.data.y * gridSize;
        switch (this.data.place.name) {
            case "NORTH":
                endX += gridSize;
                break;
            case "SOUTH":
                startY += gridSize;
                endY += gridSize;
                endX += gridSize;
                break;
            case "WEST":
                endY += gridSize
                break;
            case "EAST":
                startX += gridSize
                endX += gridSize
                endY += gridSize
                break;
        }

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
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