import { useState } from 'react';
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
      { key: 'challenge_rating', label: 'ОП (число)', type: 'number', default: 0 },
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
      { key: 'habitat', label: 'Места обитания (массив строк)', type: 'array', subfields: [
        { key: 'value', label: 'Место', type: 'text' },
      ] },
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
  // Добавьте остальные категории (классы, подклассы, расы, предметы, черты, домашние правила) аналогично
  // Для краткости я показал только монстров и заклинания — остальные вы можете добавить по аналогии
};

export default function Constructor() {
  const [category, setCategory] = useState('monsters');
  const [formData, setFormData] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');

  // Обработчик изменения полей
  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Обработчик для массивов (добавление элемента)
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

  // Обработчик для массивов (удаление элемента)
  const handleArrayRemove = (key, index) => {
    const current = formData[key] || [];
    const updated = current.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [key]: updated }));
  };

  // Обработчик для массивов (изменение элемента)
  const handleArrayItemChange = (key, index, subKey, value) => {
    const current = formData[key] || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [subKey]: value };
    setFormData(prev => ({ ...prev, [key]: updated }));
  };

  // Генерация JS-кода
  const generateCode = () => {
    const fields = CATEGORY_CONFIG[category].fields;
    const obj = {};
    fields.forEach(f => {
      const val = formData[f.key];
      if (val !== undefined && val !== null && val !== '') {
        obj[f.key] = val;
      }
    });
    const code = JSON.stringify(obj, null, 2);
    setGeneratedCode(code);
  };

  // Копирование в буфер
  const copyToClipboard = () => {
    navigator.clipboard?.writeText(generatedCode);
    alert('Код скопирован в буфер обмена!');
  };

  const fields = CATEGORY_CONFIG[category].fields;

  return (
    <div className={styles.constructor}>
      <h1>Конструктор объектов</h1>
      <div className={styles.categorySelector}>
        <label>Выберите категорию:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.form}>
        {fields.map((field) => (
          <div key={field.key} className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
                className={styles.fieldInput}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={formData[field.key] ?? field.default ?? 0}
                onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                className={styles.fieldInput}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={formData[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={field.rows || 3}
                className={styles.fieldTextarea}
              />
            )}

            {field.type === 'checkbox' && (
              <input
                type="checkbox"
                checked={formData[field.key] || false}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                className={styles.fieldCheckbox}
              />
            )}

            {field.type === 'json' && (
              <textarea
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
                        <label>{sub.label}</label>
                        {sub.type === 'text' && (
                          <input
                            type="text"
                            value={item[sub.key] || ''}
                            onChange={(e) => handleArrayItemChange(field.key, index, sub.key, e.target.value)}
                            placeholder={sub.placeholder || ''}
                            className={styles.fieldInput}
                          />
                        )}
                        {sub.type === 'textarea' && (
                          <textarea
                            value={item[sub.key] || ''}
                            onChange={(e) => handleArrayItemChange(field.key, index, sub.key, e.target.value)}
                            placeholder={sub.placeholder || ''}
                            rows={sub.rows || 2}
                            className={styles.fieldTextarea}
                          />
                        )}
                        {sub.type === 'json' && (
                          <textarea
                            value={item[sub.key] || ''}
                            onChange={(e) => handleArrayItemChange(field.key, index, sub.key, e.target.value)}
                            placeholder={sub.placeholder || 'Введите JSON'}
                            rows={3}
                            className={styles.fieldTextarea}
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => handleArrayRemove(field.key, index)}
                      className={styles.removeButton}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
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

      <div className={styles.actions}>
        <button onClick={generateCode} className={styles.generateButton}>
          Сгенерировать код
        </button>
      </div>

      {generatedCode && (
        <div className={styles.result}>
          <h3>Готовый код (скопируйте и вставьте в соответствующий файл):</h3>
          <pre className={styles.codeBlock}>{generatedCode}</pre>
          <button onClick={copyToClipboard} className={styles.copyButton}>
            Копировать в буфер
          </button>
        </div>
      )}
    </div>
  );
}
