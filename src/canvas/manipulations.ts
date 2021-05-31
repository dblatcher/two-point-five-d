import { ConvertFunction, Dimensions, Point } from "./canvas-utility"

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

function scaleTo(source: CanvasImageSource, points: Point[], convertFunction: ConvertFunction): HTMLCanvasElement {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    const xValues = points.map(point => point.x);
    const yValues = points.map(point => point.y);

    const convertedDimensions = convertFunction({
        x: Math.max(...xValues) - Math.min(...xValues),
        y: Math.max(...yValues) - Math.min(...yValues),
    })

    board.setAttribute('width', convertedDimensions[0].toString())
    board.setAttribute('height', convertedDimensions[1].toString())

    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, ...convertedDimensions)

    return board
}

function perspectiveSkew(source: HTMLCanvasElement | HTMLImageElement, right: boolean): HTMLCanvasElement | HTMLImageElement {
    const board = document.createElement('canvas')
    if (!source.width || !source.height) { return board }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return board }

    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    //TO DO - reshape to left or right wall

    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, source.width, source.height)
    return source
}

export {
    flipImage, cutFrameFromGridSheet, scaleTo, perspectiveSkew
}