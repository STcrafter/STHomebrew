import { formatChallengeRating, getDangerColor, pluralizeRu } from '../utils/helpers';

export default function CardMeta({ category, item, styles }) {
  const metaClassName = styles?.meta;
  const dangerDotClassName = styles?.dangerDot;

  if (category === 'monsters') {
    return (
      <div className={metaClassName}>
        {item.challenge_rating !== undefined && (
          <span
            className={dangerDotClassName}
            style={{ backgroundColor: getDangerColor(item.challenge_rating) }}
            title={`ОП ${formatChallengeRating(item.challenge_rating)}`}
          />
        )}
        <span>ОП {formatChallengeRating(item.challenge_rating)}</span>
        {Array.isArray(item.habitat) && item.habitat.length > 0 && (
          <span>{item.habitat.slice(0, 2).join(', ')}</span>
        )}
      </div>
    );
  }

  if (category === 'spells') {
    return (
      <div className={metaClassName}>
        <span>{item.level} {pluralizeRu(item.level, ['уровень', 'уровня', 'уровней'])}</span>
        <span>{item.school}</span>
      </div>
    );
  }

  if (category === 'items') {
    return (
      <div className={metaClassName}>
        <span>{item.rarity}</span>
        <span>{item.type}</span>
      </div>
    );
  }

  if (category === 'classes') {
    const levelCount = Array.isArray(item.features)
      ? new Set(item.features.map((f) => f.level)).size
      : 0;
    return (
      <div className={metaClassName}>
        <span>{pluralizeRu(levelCount, ['Уровень', 'Уровня', 'Уровней'])}: {levelCount}</span>
      </div>
    );
  }

  if (category === 'subclasses') {
    return (
      <div className={metaClassName}>
        <span>{item.class}</span>
        {item.tags && item.tags.length > 0 && (
          <span>{item.tags.slice(0, 3).join(', ')}</span>
        )}
      </div>
    );
  }

  if (category === 'races') {
    return (
      <div className={metaClassName}>
        <span>Особенностей: {item.features?.length || 0}</span>
      </div>
    );
  }

  if (category === 'backgrounds') {
    return (
      <div className={metaClassName}>
        {Array.isArray(item.abilities) && item.abilities.map((ab, i) => (
          <span key={i}>{ab}</span>
        ))}
      </div>
    );
  }

  if (category === 'feats') {
    return (
      <div className={metaClassName}>
        {item.category && <span>{item.category}</span>}
        <span>{item.prerequisites || 'Нет требований'}</span>
      </div>
    );
  }

  if (category === 'homerules') {
    return (
      <div className={metaClassName}>
        <span>{item.source}</span>
      </div>
    );
  }

  return null;
}
