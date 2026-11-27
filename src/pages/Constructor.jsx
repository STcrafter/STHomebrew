import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Constructor.module.css';

// ===== Конфигурация полей для каждой категории =====
const CATEGORY_CONFIG = {
  monsters: {
    label: 'Монстры',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'monster-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'type', label: 'Тип (размер, тип, мировоззрение)', type: 'text', placeholder: 'Средний монстр, хаотично-злой' },
      { key: 'category', label: 'Категория существа (для фильтра)', type: 'text', placeholder: 'Монстр' },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 3 },
      { key: 'armor_class', label: 'КД', type: 'text', placeholder: '15 (природная броня)' },
      { key: 'hit_points', label: 'ХП', type: 'text', placeholder: '42 (5d10 + 15)' },
      { key: 'speed', label: 'Скорость', type: 'text', placeholder: '30 фт., лазание 30 фт.' },
      { key: 'STR', label: 'Сила (STR)', type: 'number', default: 10 },
      { key: 'DEX', label: 'Ловкость (DEX)', type: 'number', default: 10 },
      { key: 'CON', label: 'Телосложение (CON)', type: 'number', default: 10 },
      { key: 'INT', label: 'Интеллект (INT)', type: 'number', default: 10 },
      { key: 'WIS', label: 'Мудрость (WIS)', type: 'number', default: 10 },
      { key: 'CHA', label: 'Харизма (CHA)', type: 'number', default: 10 },
      { key: 'damage_vulnerabilities', label: 'Уязвимости (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Тип урона', type: 'text' }] },
      { key: 'damage_resistances', label: 'Сопротивления (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Тип урона', type: 'text' }] },
      { key: 'damage_immunities', label: 'Иммунитеты к урону (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Тип урона', type: 'text' }] },
      { key: 'condition_immunities', label: 'Иммунитеты к состояниям (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Состояние', type: 'text' }] },
      { key: 'saving_throws', label: 'Спасброски (объект, например {"DEX": 6})', type: 'json', placeholder: '{"DEX": 6, "CON": 3}' },
      { key: 'skills', label: 'Навыки (объект, например {"Скрытность": 8})', type: 'json', placeholder: '{"Скрытность": 8, "Восприятие": 4}' },
      { key: 'senses', label: 'Чувства', type: 'text', placeholder: 'Тёмное зрение 60 фт., Пассивное Восприятие 14' },
      { key: 'languages', label: 'Языки', type: 'text', placeholder: '—' },
      { key: 'challenge_rating', label: 'ОП (число или дробь: 0.125, 0.25, 0.5, 1, 2, ...)', type: 'number', default: 0, step: 0.125 },
      { key: 'traits', label: 'Особенности (массив объектов с name, description, spells)', type: 'array', subfields: [
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
        { key: 'spells', label: 'Заклинания (объект { "По желанию": ["закл1"], ... })', type: 'json', placeholder: '{"По желанию": ["Паутина"]}' },
      ] },
      { key: 'actions', label: 'Действия (массив объектов с name, description)', type: 'array', subfields: [
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
      ] },
      { key: 'bonus_actions', label: 'Бонусные действия (массив объектов с name, description)', type: 'array', subfields: [
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
      ] },
      { key: 'reactions', label: 'Реакции (массив объектов с name, description)', type: 'array', subfields: [
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
      ] },
      { key: 'legendary_actions', label: 'Легендарные действия (объект с description и actions)', type: 'json', placeholder: '{"description": "...", "actions": [{"name": "...", "description": "..."}]}' },
      { key: 'lair_actions', label: 'Действия логова (объект с description и actions)', type: 'json', placeholder: '{"description": "...", "actions": [{"name": "...", "description": "..."}]}' },
      { key: 'habitat', label: 'Места обитания (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Место', type: 'text' }] },
      { key: 'image', label: 'Путь к картинке', type: 'text', placeholder: '/images/monster.jpg' },
    ],
  },
  spells: {
    label: 'Заклинания',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'spell-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'classes', label: 'Доступные классы (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Класс', type: 'text' }] },
      { key: 'level', label: 'Уровень', type: 'number', default: 1 },
      { key: 'school', label: 'Школа магии', type: 'text', placeholder: 'Воплощение' },
      { key: 'concentration', label: 'Требует концентрации', type: 'checkbox' },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'casting_time', label: 'Время произнесения', type: 'text', placeholder: '1 действие' },
      { key: 'range', label: 'Дистанция', type: 'text', placeholder: '120 фт.' },
      { key: 'duration', label: 'Длительность', type: 'text', placeholder: 'Мгновенная' },
      { key: 'components', label: 'Компоненты', type: 'text', placeholder: 'В, С, М (щепотка серы)' },
    ],
  },
  classes: {
    label: 'Классы',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'class-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'image', label: 'Путь к картинке', type: 'text', placeholder: '/STHomebrew/images/class.jpg' },
      { key: 'primary_ability', label: 'Основная характеристика', type: 'text' },
      { key: 'saving_throws', label: 'Спасброски (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Характеристика', type: 'text' }] },
      { key: 'hit_die', label: 'Кость хитов', type: 'text', placeholder: 'к8' },
      { key: 'proficiencies', label: 'Владения (JSON)', type: 'json', placeholder: '{"armor": ["Лёгкая броня"]}' },
      { key: 'equipment', label: 'Снаряжение', type: 'textarea', rows: 2 },
      { key: 'class_table', label: 'Таблица классов (JSON)', type: 'json', placeholder: '[{"level": 1, "proficiency_bonus": 2}]' },
      { key: 'features', label: 'Способности (массив)', type: 'array', subfields: [
        { key: 'level', label: 'Уровень', type: 'number' },
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
      ] },
      { key: 'subclasses', label: 'Подклассы (JSON)', type: 'json', placeholder: '[{"name": "...", "features": []}]' },
      { key: 'tables', label: 'Дополнительные таблицы (JSON)', type: 'json', placeholder: '[{"title": "...", "headers": [], "rows": []}]' },
    ],
  },
  subclasses: {
    label: 'Подклассы',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'subclass-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'class', label: 'Класс', type: 'text', placeholder: 'Изначальник' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'text' },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'tags', label: 'Теги (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Тег', type: 'text' }] },
      { key: 'features', label: 'Особенности (массив)', type: 'array', subfields: [
        { key: 'level', label: 'Уровень', type: 'number' },
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
      ] },
    ],
  },
  races: {
    label: 'Расы',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'race-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'image', label: 'Путь к картинке', type: 'text', placeholder: '/STHomebrew/images/race.jpg' },
      { key: 'creatureType', label: 'Тип существа', type: 'text' },
      { key: 'size', label: 'Размер', type: 'text' },
      { key: 'speed', label: 'Скорость', type: 'text' },
      { key: 'vision', label: 'Зрение', type: 'text' },
      { key: 'features', label: 'Особенности (массив)', type: 'array', subfields: [
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'description', label: 'Описание', type: 'textarea', rows: 2 },
      ] },
      { key: 'variants', label: 'Варианты (JSON)', type: 'json', placeholder: '[{"name": "...", "features": []}]' },
    ],
  },
  backgrounds: {
    label: 'Предыстории',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'background-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'abilities', label: 'Характеристики (массив строк)', type: 'array', subfields: [{ key: 'value', label: 'Характеристика', type: 'text' }] },
      { key: 'feat', label: 'Черта (JSON или название)', type: 'json', placeholder: '{"name": "..."}' },
      { key: 'proficiencies', label: 'Владения (JSON)', type: 'json', placeholder: '{"skills": [], "tools": []}' },
      { key: 'equipment', label: 'Снаряжение (JSON)', type: 'json', placeholder: '{"optionA": [], "optionB": []}' },
    ],
  },
  items: {
    label: 'Предметы',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'item-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'rarity', label: 'Редкость', type: 'text', placeholder: 'Редкий' },
      { key: 'type', label: 'Тип предмета', type: 'text' },
      { key: 'attunement', label: 'Требует настройки', type: 'checkbox' },
      { key: 'cost', label: 'Стоимость', type: 'text' },
      { key: 'recommended_price', label: 'Рекомендуемая цена', type: 'text' },
    ],
  },
  feats: {
    label: 'Черты',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'feat-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'description', label: 'Описание', type: 'textarea', rows: 4 },
      { key: 'category', label: 'Категория', type: 'text' },
      { key: 'prerequisites', label: 'Требования', type: 'text' },
      { key: 'ability', label: 'Увеличиваемая характеристика', type: 'text' },
    ],
  },
  homerules: {
    label: 'Домашние правила',
    fields: [
      { key: 'id', label: 'ID (уникальный)', type: 'text', required: true, placeholder: 'rule-1' },
      { key: 'name', label: 'Название', type: 'text', required: true },
      { key: 'source', label: 'Источник', type: 'text' },
      { key: 'content', label: 'Содержимое (Markdown)', type: 'textarea', rows: 8 },
    ],
  },
};

export default function Constructor() {
  const [category, setCategory] = useState('monsters');
  const [formData, setFormData] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  // Инициализация формы дефолтными значениями при смене категории
  useEffect(() => {
    const fields = CATEGORY_CONFIG[category].fields;
    const initialData = {};
    fields.forEach(f => {
      if (f.default !== undefined) {
        initialData[f.key] = f.default;
      }
      // Для массивов с одним подполем "value" инициализируем пустым массивом, но мы не хотим создавать пустой массив, чтобы он не попал в код
      // Поэтому оставим undefined
    });
    setFormData(initialData);
    setGeneratedCode(''); // очищаем предыдущий код
    setError('');
    setCopyStatus('');
  }, [category]);

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayAdd = (key, subfields) => {
    const current = formData[key] || [];
    const newItem = {};
    subfields.forEach(f => {
      if (f.type === 'checkbox') newItem[f.key] = false;
      else if (f.type === 'number') newItem[f.key] = 0;
      else newItem[f.key] = '';
    });
    setFormData(prev => ({ ...prev, [key]: [...current, newItem] }));
  };

  const handleArrayRemove = (key, index) => {
    const current = formData[key] || [];
    const updated = current.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [key]: updated }));
  };

  const handleArrayItemChange = (key, index, subKey, value) => {
    const current = formData[key] || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [subKey]: value };
    setFormData(prev => ({ ...prev, [key]: updated }));
  };

  const generateCode = () => {
    const fields = CATEGORY_CONFIG[category].fields;
    const obj = {};
    const invalidJson = [];

    const missing = fields
      .filter(f => f.required && String(formData[f.key] ?? '').trim() === '')
      .map(f => f.label);
    if (missing.length > 0) {
      setError(`Заполните обязательные поля: ${missing.join(', ')}`);
      setGeneratedCode('');
      return;
    }
    setError('');

    fields.forEach(f => {
      const val = formData[f.key];
      // Пропускаем undefined, null, пустые строки (для текстовых полей)
      // Но для чисел 0 и false не пропускаем
      if (val === undefined || val === null || val === '') {
        return;
      }

      // Массив строк (одно подполе "value")
      if (f.type === 'array' && f.subfields?.length === 1 && f.subfields[0].key === 'value') {
        if (Array.isArray(val) && val.length > 0) {
          const flat = val.map(item => item.value).filter(v => v && v.trim() !== '');
          if (flat.length > 0) obj[f.key] = flat;
        }
        return;
      }

      // Массив объектов (несколько подполей)
      if (f.type === 'array' && Array.isArray(val) && val.length > 0) {
        const processed = val.map(item => {
          const newItem = {};
          f.subfields.forEach(sub => {
            const subVal = item[sub.key];
            if (subVal !== undefined && subVal !== null && subVal !== '') {
              if (sub.type === 'json' && typeof subVal === 'string' && subVal.trim()) {
                try {
                  newItem[sub.key] = JSON.parse(subVal);
                } catch {
                  invalidJson.push(sub.label);
                  newItem[sub.key] = subVal;
                }
              } else {
                newItem[sub.key] = subVal;
              }
            }
          });
          return newItem;
        });
        if (processed.length > 0) obj[f.key] = processed;
        return;
      }

      // JSON-поля
      if (f.type === 'json' && typeof val === 'string' && val.trim()) {
        try {
          obj[f.key] = JSON.parse(val);
        } catch {
          invalidJson.push(f.label);
          obj[f.key] = val;
        }
        return;
      }

      // Числовые поля (включая 0)
      if (f.type === 'number') {
        obj[f.key] = Number(val);
        return;
      }

      // Булевы поля (checkbox)
      if (f.type === 'checkbox') {
        obj[f.key] = val;
        return;
      }

      // Остальные поля (текст, textarea)
      obj[f.key] = val;
    });

    if (invalidJson.length > 0) {
      setError(`Проверьте JSON в полях: ${invalidJson.join(', ')}`);
    }
    const code = JSON.stringify(obj, null, 2);
    setGeneratedCode(code);
    setCopyStatus('');
  };

  const copyToClipboard = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API недоступен');
      }
      await navigator.clipboard.writeText(generatedCode);
      setCopyStatus('Код скопирован в буфер обмена');
    } catch {
      setCopyStatus('Не удалось скопировать — выделите код вручную');
    }
  };

  const fields = CATEGORY_CONFIG[category].fields;

  return (
    <div className={styles.page} id="main-content">
      <Link to="/" className={styles.backLink}>← На главную</Link>
      <div className={styles.constructor}>
        <h1>Конструктор объектов</h1>
        <div className={styles.categorySelector}>
          <label htmlFor="category-select">Выберите категорию:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.form}>
          {fields.map((field) => (
            <div key={field.key} className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor={`field-${field.key}`}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  id={`field-${field.key}`}
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className={styles.fieldInput}
                  required={field.required}
                />
              )}

              {field.type === 'number' && (
                <input
                  id={`field-${field.key}`}
                  type="number"
                  value={formData[field.key] ?? field.default ?? 0}
                  onChange={(e) => handleFieldChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
                  step={field.step || 1}
                  className={styles.fieldInput}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  id={`field-${field.key}`}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                  rows={field.rows || 3}
                  className={styles.fieldTextarea}
                />
              )}

              {field.type === 'checkbox' && (
                <input
                  id={`field-${field.key}`}
                  type="checkbox"
                  checked={formData[field.key] || false}
                  onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                  className={styles.fieldCheckbox}
                />
              )}

              {field.type === 'json' && (
                <textarea
                  id={`field-${field.key}`}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || 'Введите JSON'}
                  rows={4}
                  className={styles.fieldTextarea}
                />
              )}

              {field.type === 'array' && (
                <div className={styles.arrayGroup}>
                  {(formData[field.key] || []).map((item, index) => (
                    <div key={index} className={styles.arrayItem}>
                      {field.subfields.map((sub) => (
                        <div key={sub.key} className={styles.arraySubfield}>
                          <label htmlFor={`array-${field.key}-${index}-${sub.key}`}>{sub.label}</label>
                          {sub.type === 'number' ? (
                            <input
                              id={`array-${field.key}-${index}-${sub.key}`}
                              type="number"
                              value={item[sub.key] ?? 0}
                              onChange={(e) => handleArrayItemChange(field.key, index, sub.key, e.target.value === '' ? '' : Number(e.target.value))}
                              className={styles.fieldInput}
                            />
                          ) : sub.type === 'textarea' || sub.type === 'json' ? (
                            <textarea
                              id={`array-${field.key}-${index}-${sub.key}`}
                              value={item[sub.key] || ''}
                              onChange={(e) => handleArrayItemChange(field.key, index, sub.key, e.target.value)}
                              placeholder={sub.placeholder || (sub.type === 'json' ? 'Введите JSON' : '')}
                              rows={sub.rows || 3}
                              className={styles.fieldTextarea}
                            />
                          ) : (
                            <input
                              id={`array-${field.key}-${index}-${sub.key}`}
                              type="text"
                              value={item[sub.key] || ''}
                              onChange={(e) => handleArrayItemChange(field.key, index, sub.key, e.target.value)}
                              placeholder={sub.placeholder || ''}
                              className={styles.fieldInput}
                            />
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove(field.key, index)}
                        className={styles.removeButton}
                        aria-label={`Удалить элемент ${index + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleArrayAdd(field.key, field.subfields)}
                    className={styles.addButton}
                  >
                    + Добавить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <div className={styles.actions}>
          <button type="button" onClick={generateCode} className={styles.generateButton}>
            Сгенерировать код
          </button>
        </div>

        {generatedCode && (
          <div className={styles.result}>
            <h3>Готовый код (скопируйте и вставьте в соответствующий файл):</h3>
            <pre className={styles.codeBlock}>{generatedCode}</pre>
            <button type="button" onClick={copyToClipboard} className={styles.copyButton}>
              Копировать в буфер
            </button>
          </div>
        )}
        <p className={styles.copyStatus} role="status" aria-live="polite">{copyStatus}</p>
      </div>
    </div>
  );
}
