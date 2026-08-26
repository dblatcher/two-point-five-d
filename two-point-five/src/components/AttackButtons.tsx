import { useState } from "react"
import { useGame } from "./GameContext"
import { FeedbackToUI } from "@/game-classes/Game"
import { ItemSlot } from "./ItemSlot"
import { AttackOption } from "@/rpg-classes/AttackOption"



const CharacterAttackButtons = ({ charcterIndex }: { charcterIndex: number }) => {
    const { gameData, game } = useGame()
    const [feedback, setFeedback] = useState<FeedbackToUI>()
    const character = gameData.characters.at(charcterIndex)

    const flashFeedBack = (newFeedback: FeedbackToUI) => {
        setFeedback(newFeedback)
        setTimeout(() => {
            setFeedback(undefined)
        }, 500)
    }

    if (!character) {
        return <div></div>
    }

    const doAttack = (option: AttackOption) => {
        const result = game().handleAttackButton({
            character,
            option
        })
        flashFeedBack(result)
    }

    const damageDone = feedback?.propertyList?.find(item => item[0] === 'damage')?.[1];

    return <div style={{
        backgroundColor: character.getMyColor(game()).lighter(100).css,
        flex: 1
    }}>
        <div style={{
            position: 'relative'
        }}>
            <ItemSlot
                getItem={() => {
                    const item = character.data.equipmentSlots?.get('RIGHT_HAND');
                    return item && item.data.type.isWieldable ? item : undefined
                }}
                style={{
                    filter: "brightness(0)"
                }}
            />
            {feedback && (
                <span style={{
                    position:'absolute',
                    left:'50%',
                    top:'50%',
                    transform: 'translateX(-50%) translateY(-50%)',
                    background: 'white',
                    color: 'black'
                }}>
                    {damageDone ?? 'miss'}
                </span>
            )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {character.attackOptions.map((option, index) =>
                <button key={index}
                    disabled={(character.attackCooldown ?? 0) > 0 || !character.canAct}
                    onClick={() => doAttack(option)}
                >{option.data.name}</button>
            )}
        </div>
    </div>
}


export const AttackButtons = () => {
    const { gameData } = useGame()
    return (
        <section style={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            {gameData.characters.map((_, index) => (
                <CharacterAttackButtons key={index} charcterIndex={index} />
            ))}
        </section>
    )
}