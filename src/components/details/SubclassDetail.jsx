import styles from '../../pages/ItemDetail.module.css';
import Markdown from '../Markdown';
import { pluralizeRu } from '../../utils/helpers';

export default function SubclassDetail({ item }) {
  return (
    <div className={styles.subclassPage}>
      <div className={styles.subclassDescription}>
        <h2>Описание подкласса</h2>
        {item.subtitle && <p className={styles.subclassSubtitle}>{item.subtitle}</p>}
        <Markdown content={item.description} />
      </div>
      {item.features && item.features.length > 0 && (
        <div className={styles.subclassFeatures}>
          <h2>Особенности</h2>
          {item.features.map((feature, idx) => (
            <div key={idx} className={styles.subclassFeature}>
              <h3 className={styles.featureTitle}>{feature.name}</h3>
              <div className={styles.featureLevel}>
                {feature.level} {pluralizeRu(feature.level, ['уровень', 'уровня', 'уровней'])} {item.name}
              </div>
              <hr className={styles.featureDivider} />
              <div className={styles.featureDescription}>
                <Markdown content={feature.description} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
