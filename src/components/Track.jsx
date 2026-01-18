export default function Track({ length = 10000 }) {
    // Safety check for length
    const validLength = Number.isFinite(length) && length > 0 ? length : 10000;

    return (
        <div
            className="absolute bottom-[100px] left-0 h-[100px] bg-gray-300 border-t-4 border-gray-400"
            style={{ width: validLength, minWidth: '100vw' }}
        >
            {/* Rails */}
            <div className="absolute top-[20px] left-0 w-full h-[10px] bg-gray-500"></div>
            <div className="absolute top-[40px] left-0 w-full h-[10px] bg-gray-500"></div>

            {/* Sleepers (repeating) */}
            <div className="w-full h-full flex overflow-hidden">
                {Array.from({ length: Math.ceil(validLength / 50) }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[20px] h-[80px] bg-amber-900 mx-[15px] shadow-inner"
                    ></div>
                ))}
            </div>
        </div>
    );
}
