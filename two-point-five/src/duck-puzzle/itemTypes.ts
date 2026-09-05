
import { ItemType } from '@/game-classes/ItemType'
import { sprites } from './sprites'

const weight = new ItemType({ id: "weight", sprite: sprites.weight, iconSprite: sprites.weightIcon })

export const itemTypes = {
    weight
}