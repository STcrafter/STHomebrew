import styles from './StatBlock.module.css';

export default function StatBlock({ monster }) {
  if (!monster || typeof monster !== 'object') return null;

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

  const savingThrows = monster.saving_throws || {};
  const skills = monster.skills || {};

  return (
    <div className={styles.statblock}>
      {/* ===== Шапка ===== */}
      {monster.type && (
        <div className={styles.header}>
          <div className={styles.type}>{monster.type}</div>
        </div>
      )}

      {/* ===== Базовые параметры ===== */}
      <div className={styles.basics}>
        {monster.armor_class && (
          <div><strong>КД</strong> {monster.armor_class}</div>
        )}
        {monster.hit_points && (
          <div><strong>ХП</strong> {monster.hit_points}</div>
        )}
        {monster.speed && (
          <div><strong>Скорость</strong> {monster.speed}</div>
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
              const score = monster[ab];
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
      {monster.senses && (
        <div className={styles.senses}><strong>Чувства</strong> {monster.senses}</div>
      )}
      {monster.languages && (
        <div className={styles.languages}><strong>Языки</strong> {monster.languages}</div>
      )}
      {monster.challenge_rating !== undefined && (
        <div className={styles.cr}><strong>ОП</strong> {monster.challenge_rating}</div>
      )}

      {/* ===== Особенности ===== */}
      {monster.traits && monster.traits.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Особенности</div>
          <div className={styles.traits}>
            {monster.traits.map((trait, idx) => (
              <div key={idx} className={styles.trait}>
                <div className={styles.traitName}>{trait.name}</div>
                <div className={styles.traitDesc}>{trait.description}</div>
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
      {monster.actions && monster.actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Действия</div>
          <div className={styles.actions}>
            {monster.actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <div className={styles.actionName}>{action.name}</div>
                <div className={styles.actionDesc}>{action.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Бонусные действия ===== */}
      {monster.bonus_actions && monster.bonus_actions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Бонусные действия</div>
          <div className={styles.bonusActions}>
            {monster.bonus_actions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <div className={styles.actionName}>{action.name}</div>
                <div className={styles.actionDesc}>{action.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Реакции ===== */}
      {monster.reactions && monster.reactions.length > 0 && (
        <>
          <div className={styles.sectionDivider}>Реакции</div>
          <div className={styles.reactions}>
            {monster.reactions.map((action, idx) => (
              <div key={idx} className={styles.action}>
                <div className={styles.actionName}>{action.name}</div>
                <div className={styles.actionDesc}>{action.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Легендарные действия ===== */}
      {monster.legendary_actions && (
        <>
          <div className={styles.sectionDivider}>Легендарные действия</div>
          <div className={styles.legendary}>
            <p className={styles.legendaryDesc}>{monster.legendary_actions.description}</p>
            <div className={styles.legendaryActions}>
              {monster.legendary_actions.actions.map((action, idx) => (
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
      {monster.lair_actions && (
        <>
          <div className={styles.sectionDivider}>Действия логова</div>
          <div className={styles.lair}>
            <p className={styles.lairDesc}>{monster.lair_actions.description}</p>
            <div className={styles.lairActions}>
              {monster.lair_actions.actions.map((action, idx) => (
                <div key={idx} className={styles.action}>
                  <div className={styles.actionName}>{action.name}</div>
                  <div className={styles.actionDesc}>{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== Места обитания ===== */}
      {monster.habitat && monster.habitat.length > 0 && (
        <div className={styles.habitat}>
          <strong>Места обитания:</strong> {monster.habitat.join(', ')}
        </div>
      )}
    </div>
  );
}
