import { useParams, Link } from 'react-router-dom';
import { data } from '../data';
import styles from './ItemDetail.module.css';
import StatBlock from '../components/StatBlock';
import ClassTable from '../components/ClassTable';
import ClassDetail from '../components/ClassDetail';

export default function ItemDetail() {
  const { category, id } = useParams();
  const items = data[category] || [];
  const item = items.find(it => it.id === id);

  if (!item) {
    return (
      <div className={styles.notFound}>
        <h2>Объект не найден</h2>
        <Link to={`/category/${category}`}>← Вернуться к списку</Link>
      </div>
    );
  }

  // Рендер содержимого в зависимости от категории
  const renderDetails = () => {
    switch (category) {
      case 'monsters':
  return (
    <>
      {item.image && (
        <div className={styles.imageWrapper}>
          <img src={item.image} alt={item.name} className={styles.detailImage} />
        </div>
      )}
      <div className={styles.description}>
        <h3>Описание</h3>
        {item.description ? (
          item.description.split(/\n\n+/).map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))
        ) : (
          <p>Описание отсутствует</p>
        )}
      </div>
      <StatBlock monster={item} />
      {item.tags && (
        <div className={styles.tags}>
          <h3>Теги</h3>
          <div className={styles.tagList}>
            {item.tags.map((tag, i) => <span key={i}>{tag}</span>)}
          </div>
        </div>
      )}
    </>
  );

      case 'spells':
        return (
          <>
            <div className={styles.spellMeta}>
              <div><strong>Уровень:</strong> {item.level}</div>
              <div><strong>Школа:</strong> {item.school}</div>
              <div><strong>Время произнесения:</strong> {item.casting_time}</div>
              <div><strong>Дистанция:</strong> {item.range}</div>
              <div><strong>Длительность:</strong> {item.duration}</div>
              <div><strong>Компоненты:</strong> {item.components}</div>
              <div><strong>Концентрация:</strong> {item.concentration ? 'Да' : 'Нет'}</div>
              <div><strong>Доступен классам:</strong> {item.classes.join(', ')}</div>
            </div>
            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{item.description}</p>
            </div>
          </>
        );

      case 'classes':
  return (
    <div className={styles.classPageWrapper}>
      <ClassDetail classData={item} />
    </div>
  );

      case 'races':
        return (
          <>
            {item.image && (
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} className={styles.detailImage} />
              </div>
            )}
            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{item.description}</p>
            </div>
            <div className={styles.features}>
              <h3>Особенности</h3>
              <ul>
                {item.features.map((feat, i) => <li key={i}>{feat}</li>)}
              </ul>
            </div>
          </>
        );

      case 'items':
        return (
          <>
            <div className={styles.itemMeta}>
              <div><strong>Редкость:</strong> {item.rarity}</div>
              <div><strong>Тип:</strong> {item.type}</div>
              <div><strong>Настройка:</strong> {item.attunement ? 'Да' : 'Нет'}</div>
              {item.cost && <div><strong>Стоимость:</strong> {item.cost}</div>}
              {item.recommended_price && <div><strong>Рекомендуемая цена:</strong> {item.recommended_price}</div>}
            </div>
            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{item.description}</p>
            </div>
          </>
        );

      case 'feats':
        return (
          <>
            <div className={styles.featMeta}>
              {item.prerequisites && <div><strong>Требования:</strong> {item.prerequisites}</div>}
            </div>
            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{item.description}</p>
            </div>
          </>
        );
case 'subclasses':
  return (
    <div className={styles.subclassPage}>
      <div className={styles.subclassDescription}>
        <h2>Описание подкласса</h2>
        <p>{item.description}</p>
      </div>
      {item.features && item.features.length > 0 && (
        <div className={styles.subclassFeatures}>
          <h2>Особенности</h2>
          {item.features.map((feature, idx) => (
            <div key={idx} className={styles.subclassFeature}>
              <h3 className={styles.featureTitle}>{feature.name}</h3>
              <div className={styles.featureLevel}>
                {feature.level} уровень {item.name}
              </div>
              <hr className={styles.featureDivider} />
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );


case 'homerules':
  return (
    <>
      <div className={styles.homeruleMeta}>
        <div><strong>Источник:</strong> {item.source}</div>
      </div>
      <div className={styles.description}>
        <h3>Описание правила</h3>
        {item.sections ? (
          // Новый структурированный формат
          <div className={styles.homeruleSections}>
            {item.sections.map((section, idx) => {
              switch (section.type) {
                case 'heading':
                  return <h4 key={idx} className={styles.homeruleHeading}>{section.content}</h4>;
                case 'paragraph':
                  return <p key={idx} className={styles.homeruleParagraph}>{section.content}</p>;
                case 'table':
                  return (
                    <div key={idx} className={styles.homeruleTableWrapper}>
                      <table className={styles.homeruleTable}>
                        <thead>
                          <tr>
                            {section.headers.map((header, i) => (
                              <th key={i}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((row, i) => (
                            <tr key={i}>
                              {row.map((cell, j) => (
                                <td key={j}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ) : (
          // Старый формат — простой текст с абзацами
          item.description ? (
            item.description.split(/\n\n+/).map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>Описание отсутствует</p>
          )
        )}
      </div>
    </>
  );
      default:
        return <p>Нет данных для этой категории</p>;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to={`/category/${category}`} className={styles.back}>← К списку</Link>
        <h1>{item.name}</h1>
      </div>
      <div className={styles.content}>
        {renderDetails()}
      </div>
    </div>
  );
}
