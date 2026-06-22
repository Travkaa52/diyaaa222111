// ═══════════════════════════════════════════════════════════════════
//  values.js — Конфігурація Дія-симулятора
//  Встановіть EXPIRY_DATE щоб заблокувати доступ після вказаного часу
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
//  ⏰  БЛОКУВАННЯ ДОСТУПУ ЗА ДАТОЮ/ЧАСОМ
//  Формат: 'YYYY-MM-DDTHH:MM:SS'  (час за локальним часовим поясом)
//  Приклад: '2025-12-31T23:59:59'  — заблокується 31 грудня 2025 о 23:59:59
//  Щоб вимкнути блокування — залиште рядок порожнім: ''
// ─────────────────────────────────────────────────────────────────
var EXPIRY_DATE = '';   // ← ВСТАВТЕ СЮДИ ДАТУ/ЧАС, наприклад: '2025-12-31T23:59:59'

// ─────────────────────────────────────────────────────────────────
//  📝  ПЕРСОНАЛЬНІ ДАНІ
// ─────────────────────────────────────────────────────────────────

// Ім'я для вітання на головному екрані (Привіт, ...)
var textName = 'Іван';

// ПІБ українською
var name = 'ІВАНЕНКО ІВАН ІВАНОВИЧ';

// ПІБ англійською (для закордонного паспорта)
var nameEn = 'IVANENKO IVAN IVANOVYCH';

// Дата народження (ДД.ММ.РРРР)
var birthDate = '01.01.1990';

// Стать
var sex    = 'Чоловіча';
var sexEn  = 'Male';

// Місце народження
var placeBirth = 'М. КИЇВ';

// Місце проживання / прописка
var legalAdress = 'М. КИЇВ, ВУЛ. ХРЕЩАТИК, БУД. 1, КВ. 1';

// Дата реєстрації місця проживання
var registeredOn = '01.01.2010';

// ─────────────────────────────────────────────────────────────────
//  🪪  ПАСПОРТ
// ─────────────────────────────────────────────────────────────────

var rnokpp       = '1234567890';       // РНОКПП (ІПН)
var uznr         = '19900101-00001';   // Запис № (УНЗР)
var nomerPasport = '123456789';        // Номер паспорта (ID-картки)
var dateGive     = '01.01.2020';       // Дата видачі
var dateOut      = '01.01.2030';       // Дійсний до
var organ        = '1234';             // Орган що видав

// ─────────────────────────────────────────────────────────────────
//  🌍  ЗАКОРДОННИЙ ПАСПОРТ
// ─────────────────────────────────────────────────────────────────

var zagran_number = 'FT000000';       // Номер закордонного паспорта
var dateGiveZ     = '01.01.2020';     // Дата видачі
var dateOutZ      = '01.01.2030';     // Дійсний до

// ─────────────────────────────────────────────────────────────────
//  🎓  СТУДЕНТСЬКИЙ КВИТОК
// ─────────────────────────────────────────────────────────────────

var nomerStudy     = '000001';
var vidanoStudy    = '01.09.2020';
var diusnuyDoStudy = '01.07.2025';
var formaStudy     = 'Денна';
var university     = 'КНУ ім. Тараса Шевченка';
var fakultat       = 'Механіко-математичний факультет';

// ─────────────────────────────────────────────────────────────────
//  🚗  ПОСВІДЧЕННЯ ВОДІЯ
// ─────────────────────────────────────────────────────────────────

var pravaNnumber  = 'МЕС000000';
var rightsCategories = 'A, B';        // Категорії водія
var dateGivePrava = '01.01.2020';
var srokPrav      = '01.01.2030';
var pravaOrgan    = 'УЖКФ ХМВО';

// ─────────────────────────────────────────────────────────────────
//  📜  ДИПЛОМ
// ─────────────────────────────────────────────────────────────────

var stepen_dip  = 'Бакалавр';
var univer_dip  = 'КНУ ім. Тараса Шевченка';
var dayout_dip  = '01.07.2022';
var special_dip = '121 Інженерія програмного забезпечення';
var number_dip  = '00000001';

// ─────────────────────────────────────────────────────────────────
//  🔫  ДОЗВІЛ НА ЗБРОЮ
// ─────────────────────────────────────────────────────────────────

var zbroyaType   = 'Пістолет ПМ (9-мм пістолет Макарова)';
var zbroyaNumber = 'ДЗ-000000';

// ─────────────────────────────────────────────────────────────────
//  🗂️  ЄДОКУМЕНТ
// ─────────────────────────────────────────────────────────────────

var adress = 'М. КИЇВ, ВУЛ. ХРЕЩАТИК, БУД. 1, КВ. 1';

// ─────────────────────────────────────────────────────────────────
//  👁️  ВИДИМІСТЬ ДОКУМЕНТІВ
//  true  = документ відображається
//  false = документ прихований
// ─────────────────────────────────────────────────────────────────

var isRightsEnabled  = true;   // Посвідчення водія
var isStudyEnabled   = true;   // Студентський квиток
var isZagranEnabled  = true;   // Закордонний паспорт
var isDiplomaEnabled = true;   // Диплом

// ═══════════════════════════════════════════════════════════════════
//  🔒  СИСТЕМА БЛОКУВАННЯ — не змінюйте цей блок
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // Якщо EXPIRY_DATE не вказано — нічого не робимо
  if (!EXPIRY_DATE || typeof EXPIRY_DATE !== 'string' || EXPIRY_DATE.trim() === '') return;

  var expiryMs;
  try {
    // Парсимо як локальний час (без "Z" в кінці)
    expiryMs = new Date(EXPIRY_DATE.trim()).getTime();
  } catch (e) {
    console.warn('[values.js] Невірний формат EXPIRY_DATE:', EXPIRY_DATE);
    return;
  }

  if (isNaN(expiryMs)) {
    console.warn('[values.js] Невірний формат EXPIRY_DATE:', EXPIRY_DATE);
    return;
  }

  function isExpired() {
    return Date.now() >= expiryMs;
  }

  function showExpiredScreen() {
    // Ховаємо весь вміст
    document.documentElement.style.overflow = 'hidden';
    var overlay = document.createElement('div');
    overlay.id = 'expiry-screen';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483647',
      'background:#fff', 'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'font-family:"e-Ukraine",sans-serif', 'text-align:center',
      'padding:30px'
    ].join(';');
    overlay.innerHTML =
      '<div style="font-size:54px;margin-bottom:20px">🔒</div>' +
      '<h2 style="font-weight:300;font-size:22px;margin-bottom:12px">Доступ завершено</h2>' +
      '<p style="color:#666;font-size:14px;max-width:280px;line-height:1.6">' +
        'Термін дії цієї демо-версії закінчився.<br>' +
        'Зверніться до автора для поновлення.' +
      '</p>';
    // Додаємо після того як DOM буде готовий
    function mount() {
      if (document.body) {
        document.body.appendChild(overlay);
        // Прибираємо всі інші елементи з видимості
        Array.from(document.body.children).forEach(function (el) {
          if (el.id !== 'expiry-screen') el.style.display = 'none';
        });
        // Очищаємо localStorage щоб не можна було обійти
        try { localStorage.clear(); } catch (_) {}
      } else {
        requestAnimationFrame(mount);
      }
    }
    mount();
  }

  // Перевіряємо одразу
  if (isExpired()) {
    // Якщо DOM вже готовий — показуємо, інакше чекаємо
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showExpiredScreen);
    } else {
      showExpiredScreen();
    }
    return;
  }

  // Плануємо блокування рівно в момент EXPIRY_DATE
  var msLeft = expiryMs - Date.now();
  // setTimeout надійний до ~24.8 днів; для більших значень — перевіряємо щохвилини
  if (msLeft <= 2147483647) {
    setTimeout(showExpiredScreen, msLeft);
  }
  // Резервна щохвилинна перевірка
  var guard = setInterval(function () {
    if (isExpired()) { clearInterval(guard); showExpiredScreen(); }
  }, 60000);

})();
