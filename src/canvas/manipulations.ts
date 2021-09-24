import { Dimensions, Point, VANISH_RATE } from "./canvas-utility"
import { Sprite } from "./Sprite"

function flipImage(source: CanvasImageSource): CanvasImageSource {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    board.setAttribute('width', source.width.toString())
    board.setAttribute('height', source.height.toString())
    ctx.scale(-1, 1);
    ctx.drawImage(source, -source.width, 0)
    return board
}

function flipImageVertically(source: CanvasImageSource): CanvasImageSource {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    board.setAttribute('width', source.width.toString())
    board.setAttribute('height', source.height.toString())
    ctx.scale(1, -1);
    ctx.drawImage(source, 0, -source.height)
    return board
}

function scaleTo(source: CanvasImageSource, width: number, height: number): CanvasImageSource {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D

    board.setAttribute('width', width.toString())
    board.setAttribute('height', height.toString())

    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height)

    return board
}

// NEEDS WORK!
function perspectiveSkew(source: CanvasImageSource, size: Dimensions, isOnObserversRight: boolean): CanvasImageSource {
    // return source
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return source }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return source }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    board.setAttribute('width', (source.width / VANISH_RATE / 2).toString())
    board.setAttribute('height', source.height.toString())

    // will only work if the sprite is centered?
    const aspect = VANISH_RATE * (size.x / size.y) * (1 / 3)


    if (isOnObserversRight) {
        for (let i = 0; i < source.height / 2; i++) {
            const vSkew = -aspect * (source.height / 2 - i) / source.height
            const oppositeSide = vSkew * source.width * (1 / 3);

            ctx.setTransform(
                1,  // horizontal scaling
                vSkew, //vertical skewing
                0, // horizontal skewing
                1,  // vertical scaling
                0, // horizontal translation
                0 // vertical translation
            )
            ctx.drawImage(source,
                0, i,           //sx, sy
                source.width, 2,                    //sw, hw
                0, i - oppositeSide,           //dx, dy
                source.width / VANISH_RATE / 2, 2  //dw, dh
            )

            //bottom
            ctx.setTransform(1, -vSkew,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height - i,
                source.width, 2,
                0, source.height - i + oppositeSide,
                source.width / VANISH_RATE / 2, 2)
        }
    } else {
        for (let i = 0; i < source.height / 2; i++) {
            ctx.setTransform(1, aspect * i / source.height,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height / 2 - i, source.width, 2,
                0, source.height / 2 - i, source.width / VANISH_RATE / 2, 2)

            ctx.setTransform(1, -aspect * i / source.height,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height / 2 + i, source.width, 2,
                0, source.height / 2 + i, source.width / VANISH_RATE / 2, 2)
        }
    }

    return board
}

function resizeFrame(source: CanvasImageSource, size: Dimensions, offset = { x: .5, y: .5 }): CanvasImageSource {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D

    const expandedFrame: Dimensions = {
        x: source.width / size.x,
        y: source.height / size.y,
    }

    board.setAttribute('width', expandedFrame.x.toString())
    board.setAttribute('height', expandedFrame.y.toString())

    const destination: Point = {
        x: (expandedFrame.x * offset.x) - source.width / 2,
        y: (expandedFrame.y * offset.y) - source.height / 2,
    }

    ctx.drawImage(source, 0, 0, source.width, source.height, destination.x, destination.y, source.width, source.height)

    return board;
}

function cropBase(source: CanvasImageSource, baseline: number): CanvasImageSource {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }
    const ctx = board.getContext('2d') as CanvasRenderingContext2D

    const croppedFrame: Dimensions = {
        x: source.width,
        y: source.height * (1 - baseline),
    }

    board.setAttribute('width', croppedFrame.x.toString())
    board.setAttribute('height', croppedFrame.y.toString())
    ctx.drawImage(source, 0, 0, source.width, croppedFrame.y, 0, 0, source.width, croppedFrame.y)
    return board;
}

function transformSpriteImage(image: CanvasImageSource, transforms: string[], sprite: Sprite):  CanvasImageSource {

    transforms.forEach(transform => {
        switch (transform) {
            case "RESIZE_CENTER":
                if (sprite.size) {
                    image = resizeFrame(image, sprite.size)
                }
                break
            case "RESIZE_OFFSET":
                if (sprite.size) {
                    image = resizeFrame(image, sprite.size, sprite.offset)
                }
                break
            case "FLIP_H":
                image = flipImage(image)
                break;
            case "SKEW_LEFT":
                image = perspectiveSkew(image, sprite.size || Sprite.DEFAULT_SIZE, false)
                break;
            case "SKEW_RIGHT":
                image = perspectiveSkew(image, sprite.size || Sprite.DEFAULT_SIZE, true)
                break;
            case "CROP_BASE":
                image = cropBase(image, sprite.baseline)
                break;
        }
    })

    return image
}

export {
    flipImage, flipImageVertically, scaleTo, perspectiveSkew, resizeFrame, transformSpriteImage
}