import styles from './ClassTable.module.css';

export default function ClassTable({ featuresByLevel }) {
  if (!featuresByLevel || typeof featuresByLevel !== 'object') return null;

  const levels = Object.keys(featuresByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className={styles.tableWrapper}>
      <h3>Особенности по уровням</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Уровень</th>
            <th>Особенности</th>
          </tr>
        </thead>
        <tbody>
          {levels.map(level => (
            <tr key={level}>
              <td className={styles.level}>{level}</td>
              <td>
                <ul className={styles.featureList}>
                  {featuresByLevel[level].map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
