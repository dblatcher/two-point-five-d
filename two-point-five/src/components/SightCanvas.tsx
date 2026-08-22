import { Dispatch, SetStateAction } from "react";
import { useGame } from "./GameContext";

interface Props {
    setCanvas: Dispatch<SetStateAction<HTMLCanvasElement | null>>;
    canvas: HTMLCanvasElement | null;
}

export const SightCanvas = ({ setCanvas, canvas }: Props) => {

    const { game } = useGame()

    return (
        <canvas
            style={{
                maxWidth: 500
            }}
            ref={setCanvas}
            onClick={(event) => {
                if (!canvas) { return }
                const rect = canvas.getBoundingClientRect();
                game().handleSightClick({
                    x: (event.clientX - rect.left) / rect.width,
                    y: (event.clientY - rect.top) / rect.height,
                })
            }}></canvas>
    )

}