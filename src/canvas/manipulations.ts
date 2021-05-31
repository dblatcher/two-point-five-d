import { ConvertFunction, Point, VANISH_RATE } from "./canvas-utility"

function flipImage(source: CanvasImageSource): HTMLCanvasElement {
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

function cutFrameFromGridSheet(source: CanvasImageSource, row: number, col: number, rows: number, cols: number): HTMLCanvasElement {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    const frameWidth = source.height / rows;
    const frameHeight = source.width / cols;
    board.setAttribute('width', frameWidth.toString())
    board.setAttribute('height', frameHeight.toString())
    ctx.drawImage(source, frameWidth * col, frameHeight * row, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight)
    return board
}

function scaleTo(source: CanvasImageSource, width:number, height:number): HTMLCanvasElement {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D

    board.setAttribute('width', width.toString())
    board.setAttribute('height', height.toString())

    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height)

    return board
}

function perspectiveSkew(source: HTMLCanvasElement | HTMLImageElement, right: boolean): HTMLCanvasElement | HTMLImageElement {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    board.setAttribute('width', (source.width/VANISH_RATE/2).toString())
    board.setAttribute('height', source.height.toString())
    //TO DO - reshape to left or right wall

    if (right) {
        const aspect = VANISH_RATE/2

        for (let i = 0; i < source.height / 2; i++) {
            ctx.setTransform(1, -aspect * i / source.height,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height / 2 - i, source.width, 2,
                0, source.height / 2 - i, source.width / VANISH_RATE/2, 2)

            ctx.setTransform(1, aspect * i / source.height,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height / 2 + i, source.width, 2,
                0, source.height / 2 + i, source.width / VANISH_RATE/2,2)
        }
    } else {
        const aspect = VANISH_RATE/2

        for (let i = 0; i < source.height / 2; i++) {
            ctx.setTransform(1, aspect * i / source.height,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height / 2 - i, source.width, 2,
                0, source.height / 2 - i, source.width / VANISH_RATE/2, 2)

            ctx.setTransform(1, -aspect * i / source.height,
                0, 1, 0, 0)
            ctx.drawImage(source,
                0, source.height / 2 + i, source.width, 2,
                0, source.height / 2 + i, source.width / VANISH_RATE/2,2)
        }
    }


    
    return board
}

export {
    flipImage, cutFrameFromGridSheet, scaleTo, perspectiveSkew
}