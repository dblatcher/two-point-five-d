function flipImage(source: CanvasImageSource): CanvasImageSource {
    if (!source.width || !source.height) { return source }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return source }
    const board = document.createElement('canvas')
    const ctx = board.getContext('2d') as CanvasRenderingContext2D

    board.setAttribute('width', source.width.toString())
    board.setAttribute('height', source.height.toString())
    ctx.scale(-1, 1);
    ctx.drawImage(source, -source.width, 0)
    return board
}

function cutFrameFromGridSheet(source: CanvasImageSource, row: number, col: number, rows: number, cols: number): CanvasImageSource {
    if (!source.width || !source.height) { return source }
    if (typeof source.width !== 'number' || typeof source.height != 'number') { return source }
    const board = document.createElement('canvas')
    const ctx = board.getContext('2d') as CanvasRenderingContext2D

    const frameWidth = source.height / rows;
    const frameHeight = source.width / cols;
    board.setAttribute('width', frameWidth.toString())
    board.setAttribute('height', frameHeight.toString())
    ctx.drawImage(source, frameWidth*col, frameHeight*row, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight)
    return board
}

export {
    flipImage, cutFrameFromGridSheet,
}