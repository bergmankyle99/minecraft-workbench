interface MinecraftButtonProps {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
}

export default function MinecraftButton({
    text,
    onClick,
    type = "button",
    disabled = false
}: MinecraftButtonProps) {

    return (
        <button
            className="mc-button"
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="title">
                {text}
            </span>
        </button>
    );
}