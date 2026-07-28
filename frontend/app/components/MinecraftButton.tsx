interface MinecraftButtonProps {
    text: string;
    onClick?: () => void;
}

export default function MinecraftButton({
    text,
    onClick
}: MinecraftButtonProps) {

    return (
        <button 
            className="mc-button"
            onClick={onClick}
        >
            <span className="title">
                {text}
            </span>
        </button>
    );
}