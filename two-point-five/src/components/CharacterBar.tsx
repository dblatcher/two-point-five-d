import { Game } from "@/game-classes/Game";
import { PortraitSprite } from "@/rpg-classes/PortraitSprite";
import { EquipmentSlotButton } from "./EquipmentSlotButton";
import { useCharacter, useGame } from "./GameContext";
import { SpriteIcon } from "./SpriteIcon";
import { StatBars } from "./StatBars";



const CharacterBlock = ({ index, setCharacterScreenOpen }: {
    index: number;
    setCharacterScreenOpen: { (characterIndex?: number): void }
}) => {
    const [characterData] = useCharacter(index)
    if (!characterData) {
        return <div></div>
    }

    return <div style={{
        backgroundColor: Game.CHARACTER_COLORS[index].css,
        display: 'grid',
        gridTemplateAreas: `
            "a b b c"
            "a d d c"
            "a d d c"
        `,
    }}>
        <div style={{ gridArea: 'c' }}>
            <StatBars stats={characterData.stats} />
        </div>
        <div style={{
            gridArea: 'b',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
        }}>
            <button onClick={() => setCharacterScreenOpen(index)}>
                <b>{characterData.name}</b>
            </button>
        </div>

        <div style={{
            gridArea: 'a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <SpriteIcon
                spriteId={characterData.portraitSpriteId}
                actionName={PortraitSprite.defaultPortraitAnimation}
                style={{
                    width: "100%",
                    aspectRatio: 1
                }}
            />
        </div>

        <div style={{ gridArea: 'd', }}>
            <EquipmentSlotButton characterIndex={index} equipmentSlot="LEFT_HAND" />
            <EquipmentSlotButton characterIndex={index} equipmentSlot="RIGHT_HAND" />
        </div>
    </div>
}

export const CharacterBar = ({ setCharacterScreenOpen }: { setCharacterScreenOpen: { (characterIndex?: number): void } }) => {

    const { gameData } = useGame()

    return <section style={{
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
    }}>
        {gameData.characters.map((_character, index) => (
            <CharacterBlock key={index}
                setCharacterScreenOpen={setCharacterScreenOpen}
                index={index} />
        ))}
    </section>
}