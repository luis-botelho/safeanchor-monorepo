import Icon from "./Icon";

export default function Rating({ value = 0, size = 16 }) {
  return (
    <span className="rating" aria-label={`Avaliação ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Icon
          key={index}
          name="star"
          size={size}
          className={`rating__star ${index <= Math.round(value) ? "rating__star--on" : ""}`}
        />
      ))}
      <span className="rating__value">{value.toFixed(1)}</span>
    </span>
  );
}