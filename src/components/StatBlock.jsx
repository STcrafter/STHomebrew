import styles from './StatBlock.module.css';
import { formatChallengeRating } from '../utils/helpers';


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
              // Если спасбросок указан явно – используем его, иначе – модификатор характеристики
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
{/* ===== Уязвимости, Сопротивления, Иммунитеты ===== */}
{(data.damage_vulnerabilities?.length > 0 ||
  data.damage_resistances?.length > 0 ||
  data.damage_immunities?.length > 0 ||
  data.condition_immunities?.length > 0) && (
  <div className={styles.damageInfo}>
    {data.damage_vulnerabilities?.length > 0 && (
      <div><strong>Уязвимости</strong> {data.damage_vulnerabilities.join(', ')}</div>
    )}
    {data.damage_resistances?.length > 0 && (
      <div><strong>Сопротивления</strong> {data.damage_resistances.join(', ')}</div>
    )}
    {data.damage_immunities?.length > 0 && (
      <div><strong>Иммунитеты к урону</strong> {data.damage_immunities.join(', ')}</div>
    )}
    {data.condition_immunities?.length > 0 && (
      <div><strong>Иммунитеты к состояниям</strong> {data.condition_immunities.join(', ')}</div>
    )}
  </div>
)}
      {/* Чувства, языки, ОП */}
      {data.senses && <div className={styles.senses}><strong>Чувства</strong> {data.senses}</div>}
      {data.languages && <div className={styles.languages}><strong>Языки</strong> {data.languages}</div>}
      {data.challenge_rating !== undefined && (
  <div className={styles.cr}>
    <strong>ОП</strong> {formatChallengeRating(data.challenge_rating)}
  </div>
)}

      {/* Особенности */}
      {data.traits && data.traits.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Особенности</div>
          <div className={styles.traits}>
            {data.traits.map((trait, idx) => (
              <div key={idx} className={styles.trait}>
                <span className={styles.traitName}>{trait.name}.</span>{' '}
                <span className={styles.traitDesc}>{trait.description}</span>
                {trait.spells && (
                  <div className={styles.spellList}>
                    {Object.entries(trait.spells).map(([freq, spells]) => (
                      <div key={freq} className={styles.spellGroup}>
                        <span className={styles.spellFreq}>{freq}</span>
                        <span className={styles.spellNames}>{spells.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Действия */}
      {data.actions && data.actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Действия</div>
          <div className={styles.actions}>
            {data.actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <span className={styles.actionName}>{action.name}.</span>{' '}
                <span className={styles.actionDesc}>{action.description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Бонусные действия */}
      {data.bonus_actions && data.bonus_actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Бонусные действия</div>
          <div className={styles.bonusActions}>
            {data.bonus_actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <span className={styles.actionName}>{action.name}.</span>{' '}
                <span className={styles.actionDesc}>{action.description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Реакции */}
      {data.reactions && data.reactions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Реакции</div>
          <div className={styles.reactions}>
            {data.reactions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <span className={styles.actionName}>{action.name}.</span>{' '}
                <span className={styles.actionDesc}>{action.description}</span>
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
            <p className={styles.legendaryDesc}>{data.legendary_actions.description}</p>
            <div className={styles.legendaryActions}>
              {data.legendary_actions.actions.map((action, idx) => (
                <div key={idx} className={styles.action}>
                  <span className={styles.actionName}>{action.name}.</span>{' '}
                  <span className={styles.actionDesc}>{action.description}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Действия логова */}
      {data.lair_actions && (
        <>
          <div className={styles.sectionDivider}>Действия логова</div>
          <div className={styles.lair}>
            <p className={styles.lairDesc}>{data.lair_actions.description}</p>
            <div className={styles.lairActions}>
              {data.lair_actions.actions.map((action, idx) => (
                <div key={idx} className={styles.action}>
                  <span className={styles.actionName}>{action.name}.</span>{' '}
                  <span className={styles.actionDesc}>{action.description}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Места обитания */}
      {data.habitat && data.habitat.length > 0 && (
        <div className={styles.habitat}>
          <strong>Места обитания:</strong> {data.habitat.join(', ')}
        </div>
      )}
    </div>
  );
}
