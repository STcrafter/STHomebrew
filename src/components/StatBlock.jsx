import styles from './StatBlock.module.css';

export default function StatBlock({ stats }) {
  if (!stats || typeof stats !== 'object') return null;

  const statLabels = {
    STR: 'Сила',
    DEX: 'Ловкость',
    CON: 'Телосложение',
    INT: 'Интеллект',
    WIS: 'Мудрость',
    CHA: 'Харизма',
  };

  return (
    <div className={styles.block}>
      <h3>Статблок</h3>
      <div className={styles.grid}>
        {Object.entries(stats).map(([key, value]) => {
          if (key in statLabels) {
            const mod = Math.floor((value - 10) / 2);
            return (
              <div key={key} className={styles.stat}>
                <span className={styles.label}>{statLabels[key]}</span>
                <span className={styles.value}>{value} ({mod >= 0 ? '+' : ''}{mod})</span>
              </div>
            );
          }
          if (['AC', 'HP', 'Speed', 'Saves', 'Skills', 'Damage_Immunities', 'Damage_Resistances', 'Damage_Vulnerabilities', 'Senses', 'Languages', 'CR'].includes(key)) {
            return (
              <div key={key} className={styles.metaStat}>
                <span className={styles.label}>{key.replace(/_/g, ' ')}</span>
                <span className={styles.value}>{value}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
