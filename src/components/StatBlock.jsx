import styles from './StatBlock.module.css';

export default function StatBlock({ stats }) {
  if (!stats || typeof stats !== 'object') return null;

  // ===== Вспомогательные функции =====
  const getModifier = (score) => {
    if (score === undefined || score === null) return null;
    const mod = Math.floor((score - 10) / 2);
    return mod;
  };

  const formatMod = (mod) => {
    if (mod === null) return '—';
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // ===== Характеристики =====
  const statAbilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const statLabels = {
    STR: 'СИЛ',
    DEX: 'ЛОВ',
    CON: 'ТЕЛ',
    INT: 'ИНТ',
    WIS: 'МУД',
    CHA: 'ХАР',
  };

  // Спасброски — либо из поля saving_throws, либо вычисляем мод
  const savingThrows = stats.saving_throws || {};

  // Навыки
  const skills = stats.skills || {};

  return (
    <div className={styles.statblock}>
      {/* ===== Шапка ===== */}
      <div className={styles.header}>
        {stats.type && <div className={styles.type}>{stats.type}</div>}
      </div>

      {/* ===== Базовые параметры ===== */}
      <div className={styles.basics}>
        {stats.armor_class && (
          <div><strong>КД</strong> {stats.armor_class}</div>
        )}
        {stats.hit_points && (
          <div><strong>ХП</strong> {stats.hit_points}</div>
        )}
        {stats.speed && (
          <div><strong>Скорость</strong> {stats.speed}</div>
        )}
      </div>

      {/* ===== Таблица характеристик ===== */}
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
              const score = stats[ab];
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
              const saveBonus = savingThrows[ab] !== undefined ? savingThrows[ab] : null;
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

      {/* ===== Навыки ===== */}
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

      {/* ===== Чувства, языки, ОП ===== */}
      {stats.senses && (
        <div className={styles.senses}><strong>Чувства</strong> {stats.senses}</div>
      )}
      {stats.languages && (
        <div className={styles.languages}><strong>Языки</strong> {stats.languages}</div>
      )}
      {stats.challenge_rating !== undefined && (
        <div className={styles.cr}><strong>ОП</strong> {stats.challenge_rating}</div>
      )}

      {/* ===== Особенности (traits) ===== */}
      {stats.traits && stats.traits.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Особенности</div>
          <div className={styles.traits}>
            {stats.traits.map((trait, idx) => (
              <div key={idx} className={styles.trait}>
                <div className={styles.traitName}>{trait.name}</div>
                <div className={styles.traitDesc}>{trait.description}</div>
                {/* Если есть заклинания */}
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

      {/* ===== Действия ===== */}
      {stats.actions && stats.actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Действия</div>
          <div className={styles.actions}>
            {stats.actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <div className={styles.actionName}>{action.name}</div>
                <div className={styles.actionDesc}>{action.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Бонусные действия ===== */}
      {stats.bonus_actions && stats.bonus_actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Бонусные действия</div>
          <div className={styles.bonusActions}>
            {stats.bonus_actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <div className={styles.actionName}>{action.name}</div>
                <div className={styles.actionDesc}>{action.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Реакции ===== */}
      {stats.reactions && stats.reactions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Реакции</div>
          <div className={styles.reactions}>
            {stats.reactions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <div className={styles.actionName}>{action.name}</div>
                <div className={styles.actionDesc}>{action.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Легендарные действия ===== */}
      {stats.legendary_actions && (
        <>
          <div className={styles.sectionDivider}>Легендарные действия</div>
          <div className={styles.legendary}>
            <p className={styles.legendaryDesc}>{stats.legendary_actions.description}</p>
            <div className={styles.legendaryActions}>
              {stats.legendary_actions.actions.map((action, idx) => (
                <div key={idx} className={styles.action}>
                  <div className={styles.actionName}>{action.name}</div>
                  <div className={styles.actionDesc}>{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== Действия логова ===== */}
      {stats.lair_actions && (
        <>
          <div className={styles.sectionDivider}>Действия логова</div>
          <div className={styles.lair}>
            <p className={styles.lairDesc}>{stats.lair_actions.description}</p>
            <div className={styles.lairActions}>
              {stats.lair_actions.actions.map((action, idx) => (
                <div key={idx} className={styles.action}>
                  <div className={styles.actionName}>{action.name}</div>
                  <div className={styles.actionDesc}>{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== Места обитания (для информации, можно вывести внизу) ===== */}
      {stats.habitat && stats.habitat.length > 0 && (
        <div className={styles.habitat}>
          <strong>Места обитания:</strong> {stats.habitat.join(', ')}
        </div>
      )}
    </div>
  );
}
