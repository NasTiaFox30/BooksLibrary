export function Tape({ degree, size, top, left, bottom, right }) {
  return (
    <div
      className="absolute z-10 opacity-80 flex items-center justify-center select-none pointer-events-none"
      style={{
        height: size !== null ? size + "px" : "50px",
        width: size !== null ? size + "px" : "50px",
        transform: `rotate(${degree}deg)`,
        top: top !== null ? `${top}px` : 'auto',
        left: left !== null ? `${left}px` : 'auto',
        bottom: bottom !== null ? `${bottom}px` : 'auto',
        right: right !== null ? `${right}px` : 'auto',
      }}
    >
      <img src="/textures/tape.png" alt="tape" />
    </div>
  );
}