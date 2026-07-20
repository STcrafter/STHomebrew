import styles from './StatBlock.module.css';
import { formatChallengeRating, getProficiencyBonusForCR, getXPForCR } from '../utils/helpers';

export default function StatBlock({ monster }) {
  const data = monster?.statblock || monster;
  if (!data || typeof data !== 'object') return null;

  const getModifier = (score) => {
    if (score === undefined || score === null) return null;
    const mod = Math.floor((score - 10) / 2);
    return mod;
  };

  const formatMod = (mod) => {
    if (mod === null) return '—';
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const statAbilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const statLabels = {
    STR: 'СИЛ',
    DEX: 'ЛОВ',
    CON: 'ТЕЛ',
    INT: 'ИНТ',
    WIS: 'МУД',
    CHA: 'ХАР',
  };

  const savingThrows = data.saving_throws || {};
  const skills = data.skills || {};

  // ===== Универсальная функция для рендера списка заклинаний =====
  const renderSpellList = (spells) => {
    if (!spells) return null;
    // Если spells — массив, попробуем преобразовать в объект
    if (Array.isArray(spells)) {
      const combined = {};
      spells.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.entries(item).forEach(([key, val]) => {
            if (!combined[key]) combined[key] = [];
            if (Array.isArray(val)) combined[key].push(...val);
            else if (typeof val === 'string') combined[key].push(val);
          });
        }
      });
      spells = combined;
    }
    if (typeof spells !== 'object' || spells === null) return null;

    return (
      <div className={styles.spellList}>
        {Object.entries(spells).map(([freq, spellArray]) => {
          let display = '';
          if (Array.isArray(spellArray)) {
            display = spellArray.join(', ');
          } else if (typeof spellArray === 'string') {
            display = spellArray;
          } else if (typeof spellArray === 'object' && spellArray !== null) {
            display = Object.values(spellArray).join(', ');
          } else {
            display = String(spellArray);
          }
          return (
            <div key={freq} className={styles.spellGroup}>
              <span className={styles.spellFreq}>{freq}</span>
              <span className={styles.spellNames}>{display}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // ===== Безопасное приведение к строке =====
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // ===== Рендер текста с абзацами =====
  const renderParagraphs = (text) => {
    if (!text) return null;
    const str = safeString(text);
    if (!str) return null;
    return str.split(/\n\n+/).map((p, idx) => <p key={idx} className={styles.lairText}>{p}</p>);
  };

  // ===== Безопасный рендер массива =====
  const renderArray = (arr, joinStr = ', ') => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr.join(joinStr);
  };

  return (
    <div className={styles.statblock}>
      {/* Шапка */}
      {data.type && (
        <div className={styles.header}>
          <div className={styles.type}>{data.type}</div>
        </div>
      )}

      {/* Базовые параметры */}
      <div className={styles.basics}>
        {data.armor_class && <div><strong>КД</strong> {data.armor_class}</div>}
        {data.hit_points && <div><strong>ХП</strong> {data.hit_points}</div>}
        {data.speed && <div><strong>Скорость</strong> {data.speed}</div>}
      </div>

      {/* Таблица характеристик и спасбросков */}
      <table className={styles.statsTable}>
        <thead>
          <tr>
            {statAbilities.map(ab => (
              <th key={ab}>{statLabels[ab]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {statAbilities.map(ab => {
              const score = data[ab];
              const mod = getModifier(score);
              return (
                <td key={ab}>
                  <span className={styles.score}>{score ?? '—'}</span>
                  <span className={styles.mod}>({formatMod(mod)})</span>
                </td>
              );
            })}
          </tr>
          <tr className={styles.saveRow}>
            {statAbilities.map(ab => {
              const saveBonus = savingThrows[ab] !== undefined
                ? savingThrows[ab]
                : getModifier(data[ab]);
              return (
                <td key={ab}>
                  <span className={styles.saveLabel}>Спас.</span>
                  <span className={styles.saveValue}>
                    {saveBonus !== null ? formatMod(saveBonus) : '—'}
                  </span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* Навыки */}
      {Object.keys(skills).length > 0 && (
        <div className={styles.skills}>
          <strong>Навыки</strong>{' '}
          {Object.entries(skills).map(([name, value], idx, arr) => (
            <span key={name}>
              {name} {value >= 0 ? '+' : ''}{value}
              {idx < arr.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}

      {/* Уязвимости, Сопротивления, Иммунитеты */}
      {(Array.isArray(data.damage_vulnerabilities) && data.damage_vulnerabilities.length > 0 ||
        Array.isArray(data.damage_resistances) && data.damage_resistances.length > 0 ||
        Array.isArray(data.damage_immunities) && data.damage_immunities.length > 0 ||
        Array.isArray(data.condition_immunities) && data.condition_immunities.length > 0) && (
        <div className={styles.damageInfo}>
          {renderArray(data.damage_vulnerabilities) && (
            <div><strong>Уязвимости</strong> {renderArray(data.damage_vulnerabilities)}</div>
          )}
          {renderArray(data.damage_resistances) && (
            <div><strong>Сопротивления</strong> {renderArray(data.damage_resistances)}</div>
          )}
          {renderArray(data.damage_immunities) && (
            <div><strong>Иммунитеты к урону</strong> {renderArray(data.damage_immunities)}</div>
          )}
          {renderArray(data.condition_immunities) && (
            <div><strong>Иммунитеты к состояниям</strong> {renderArray(data.condition_immunities)}</div>
          )}
        </div>
      )}

      {/* Чувства, языки, ОП */}
      {data.senses && <div className={styles.senses}><strong>Чувства</strong> {data.senses}</div>}
      {data.languages && <div className={styles.languages}><strong>Языки</strong> {data.languages}</div>}
      {data.challenge_rating !== undefined && (
        <div className={styles.cr}>
          <strong>ОП</strong> {formatChallengeRating(data.challenge_rating)}
          {' (+' + getProficiencyBonusForCR(data.challenge_rating) + ' БМ, ' + getXPForCR(data.challenge_rating) + ' XP)'}
        </div>
      )}

      {/* Особенности (traits) */}
      {Array.isArray(data.traits) && data.traits.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Особенности</div>
          <div className={styles.traits}>
            {data.traits.map((trait, idx) => (
              <div key={idx} className={styles.trait}>
                <span className={styles.traitName}>{safeString(trait.name)}.</span>{' '}
                <span className={styles.traitDesc}>{safeString(trait.description)}</span>
                {renderSpellList(trait.spells)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Действия */}
      {Array.isArray(data.actions) && data.actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Действия</div>
          <div className={styles.actions}>
            {data.actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <span className={styles.actionName}>{safeString(action.name)}.</span>{' '}
                <span className={styles.actionDesc}>{safeString(action.description)}</span>
                {renderSpellList(action.spells)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Бонусные действия */}
      {Array.isArray(data.bonus_actions) && data.bonus_actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Бонусные действия</div>
          <div className={styles.bonusActions}>
            {data.bonus_actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <span className={styles.actionName}>{safeString(action.name)}.</span>{' '}
                <span className={styles.actionDesc}>{safeString(action.description)}</span>
                {renderSpellList(action.spells)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Реакции */}
      {Array.isArray(data.reactions) && data.reactions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Реакции</div>
          <div className={styles.reactions}>
            {data.reactions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <span className={styles.actionName}>{safeString(action.name)}.</span>{' '}
                <span className={styles.actionDesc}>{safeString(action.description)}</span>
                {renderSpellList(action.spells)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Легендарные действия */}
      {data.legendary_actions && (
        <>
          <div className={styles.sectionDivider}>Легендарные действия</div>
          <div className={styles.legendary}>
            <p className={styles.legendaryDesc}>{safeString(data.legendary_actions.description)}</p>
            {Array.isArray(data.legendary_actions.actions) && data.legendary_actions.actions.length > 0 && (
              <div className={styles.legendaryActions}>
                {data.legendary_actions.actions.map((action, idx) => (
                  <div key={idx} className={styles.action}>
                    <span className={styles.actionName}>{safeString(action.name)}.</span>{' '}
                    <span className={styles.actionDesc}>{safeString(action.description)}</span>
                    {renderSpellList(action.spells)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Действия логова */}
      {data.lair_actions && (
        <>
          <div className={styles.sectionDivider}>Действия логова</div>
          <div className={styles.lair}>
            <p className={styles.lairDesc}>{safeString(data.lair_actions.description)}</p>
            {Array.isArray(data.lair_actions.actions) && data.lair_actions.actions.length > 0 && (
              <div className={styles.lairActions}>
                {data.lair_actions.actions.map((action, idx) => (
                  <div key={idx} className={styles.action}>
                    <span className={styles.actionName}>{safeString(action.name)}.</span>{' '}
                    <span className={styles.actionDesc}>{safeString(action.description)}</span>
                    {renderSpellList(action.spells)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Описание логова */}
      {data.lair_description && (
        <div className={styles.lairDescription}>
          <div className={styles.sectionDivider}>Логово</div>
          <div className={styles.lairContent}>
            {typeof data.lair_description === 'string' ? (
              renderParagraphs(data.lair_description)
            ) : (
              <>
                {data.lair_description.description && renderParagraphs(data.lair_description.description)}
                {Array.isArray(data.lair_description.effects) && data.lair_description.effects.length > 0 && (
                  <div className={styles.lairEffects}>
                    <h4 className={styles.lairEffectsTitle}>Эффекты логова</h4>
                    {data.lair_description.effects.map((effect, idx) => (
                      <div key={idx} className={styles.lairEffect}>
                        <span className={styles.lairEffectName}>{safeString(effect.name)}.</span>{' '}
                        <span className={styles.lairEffectDesc}>{safeString(effect.description)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Предания (лор) */}
      {data.lore && (
        <div className={styles.loreBlock}>
          {data.lore.title && <div className={styles.sectionDivider}>{safeString(data.lore.title)}</div>}
          <div className={styles.loreContent}>
            {(() => {
              if (Array.isArray(data.lore)) {
                return data.lore.map((item, idx) => (
                  <p key={idx} className={styles.loreText}>{safeString(item)}</p>
                ));
              } else if (data.lore.items && Array.isArray(data.lore.items)) {
                return data.lore.items.map((item, idx) => {
                  if (item.type === 'quote') {
                    return (
                      <blockquote key={idx} className={styles.loreQuote}>
                        <span className={styles.quoteText}>«{safeString(item.content)}»</span>
                        {item.author && <cite className={styles.quoteAuthor}>— {safeString(item.author)}</cite>}
                      </blockquote>
                    );
                  } else {
                    return <p key={idx} className={styles.loreText}>{safeString(item.content)}</p>;
                  }
                });
              } else {
                return null;
              }
            })()}
          </div>
        </div>
      )}

      {/* Места обитания */}
      {Array.isArray(data.habitat) && data.habitat.length > 0 && (
        <div className={styles.habitat}>
          <strong>Места обитания:</strong> {data.habitat.join(', ')}
        </div>
      )}
    </div>
  );
}