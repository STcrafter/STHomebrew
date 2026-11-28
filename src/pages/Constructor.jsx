import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Constructor.module.css';
import { categories } from '../config/categories';
import { constructorSchemas } from '../config/constructorSchemas';

export default function Constructor() {
  const categoryOptions = Object.entries(categories).filter(([id]) => constructorSchemas[id]);
  const [category, setCategory] = useState(categoryOptions[0]?.[0] ?? 'monsters');
  const [formData, setFormData] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  // Инициализация формы дефолтными значениями при смене категории
  useEffect(() => {
    const fields = constructorSchemas[category]?.fields ?? [];
    const initialData = {};
    fields.forEach(f => {
      if (f.default !== undefined) {
        initialData[f.key] = f.default;
      }
    });
    setFormData(initialData);
    setGeneratedCode('');
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
    const fields = constructorSchemas[category]?.fields ?? [];
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

  const fields = constructorSchemas[category]?.fields ?? [];

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
            {categoryOptions.map(([key]) => (
              <option key={key} value={key}>{categories[key]?.label ?? key}</option>
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
