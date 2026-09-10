export default function Avatar({ initials, size = 40, tone = "neutral" }) {
  const style = { width: size, height: size };

  return (
    <span className={`avatar avatar--${tone}`} style={style} aria-hidden="true">
      {initials}
    </span>
  );
}