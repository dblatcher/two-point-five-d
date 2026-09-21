
import { ItemType } from '@/game-classes/ItemType'
import { duckPuzzleSprites } from './sprites'

const weight = new ItemType({ id: "weight", sprite: duckPuzzleSprites.weight, iconSprite: duckPuzzleSprites.weightIcon })

export const itemTypes = {
    weight
}