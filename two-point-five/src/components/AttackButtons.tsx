import { useState } from "react"
import { useGame } from "./GameContext"
import { FeedbackToUI } from "@/game-classes/Game"
import { ItemSlot } from "./ItemSlot"



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


    return <div style={{
        backgroundColor: character.getMyColor(game()).lighter(100).css,
        flex: 1
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {character.attackOptions.map((option, index) =>
                <button key={index}
                    disabled={(character.attackCooldown ?? 0) > 0}
                    onClick={() => {

                        if (!character) {
                            return
                        }
                        const result = game().handleAttackButton({
                            character,
                            option
                        })
                        flashFeedBack(result)
                    }}
                >{option.data.name}</button>
            )}
        </div>
        <div>{feedback?.message}</div>
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