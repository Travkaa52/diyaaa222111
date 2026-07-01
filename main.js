/**
 * main.js — застосовує дані з values.js до DOM
 * Всі змінні (fio, birth і т.д.) визначені у values.js
 * Запускається після того, як DOM готовий
 */
(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // Допоміжна функція: заповнює всі елементи з даним id/selector
    // ─────────────────────────────────────────────────────────────
    function fill(selector, value) {
        if (value === undefined || value === null) return;
        var str = String(value);
        document.querySelectorAll(selector).forEach(function (el) {
            el.textContent = str;
        });
    }

    function fillImg(selector, src) {
        if (!src) return;
        document.querySelectorAll(selector).forEach(function (el) {
            el.src = src;
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Читаємо з values.js (через window.*) з fallback на undefined
    // ─────────────────────────────────────────────────────────────
    function v(key) { return window[key]; }

    function applyAll() {
        // ── ПІБ ──────────────────────────────────────────────────
        fill('#name',       v('name')   || v('fio'));
        fill('#nameEn',     v('nameEn') || v('fio_en'));
        fill('#textName',   v('textName') || (v('name') || '').split(' ')[1] || (v('fio') || '').split(' ')[1]);

        // ── Дата народження ──────────────────────────────────────
        fill('#birthDate',  v('birthDate') || v('birth'));

        // ── РНОКПП / ІПН ─────────────────────────────────────────
        fill('#rnokpp',     v('rnokpp'));

        // ── Паспорт ───────────────────────────────────────────────
        fill('#nomerPasport', v('nomerPasport') || v('pass_number'));
        fill('#dateGive',   v('dateGive')  || v('date_give'));
        fill('#dateOut',    v('dateOut')   || v('date_out'));
        fill('#organ',      v('organ'));
        fill('#uznr',       v('uznr'));
        fill('#placeBirth', v('placeBirth') || v('live'));
        fill('#legalAdress',v('legalAdress'));
        fill('#registeredOn', v('registeredOn'));

        // ── Стать ─────────────────────────────────────────────────
        fill('#sex',    v('sex'));
        fill('#sexEn',  v('sexEn') || v('sex_en'));

        // ── Закордонний паспорт ───────────────────────────────────
        fill('#zagran_number', v('zagran_number') || v('zagranNumber'));
        fill('#dateGiveZ', v('dateGiveZ'));
        fill('#dateOutZ',  v('dateOutZ'));

        // ── Водійське ─────────────────────────────────────────────
        fill('#pravaNnumber',   v('pravaNnumber')  || v('prava_number'));
        fill('#dateGivePrava',  v('dateGivePrava') || v('prava_date_give'));
        fill('#srokPrav',       v('srokPrav')      || v('prava_date_out'));
        fill('#pravaOrgan',     v('pravaOrgan'));
        fill('[data-field="rightsCategories"]', v('rightsCategories') || v('rights_categories'));
        // також ID-версія якщо є
        fill('#rightsCategories', v('rightsCategories') || v('rights_categories'));

        // ── Студентський ──────────────────────────────────────────
        fill('#nomerStudy',     v('nomerStudy')     || v('student_number'));
        fill('#vidanoStudy',    v('vidanoStudy')    || v('student_date_give'));
        fill('#diusnuyDoStudy', v('diusnuyDoStudy') || v('student_date_out'));
        fill('#formaStudy',     v('formaStudy')     || v('form'));
        fill('#university',     v('university'));
        fill('#fakultat',       v('fakultat')       || v('fakultet'));

        // ── Диплом ───────────────────────────────────────────────
        fill('#stepen_dip', v('stepen_dip') ? ('Диплом ' + v('stepen_dip')) : undefined);
        fill('#univer_dip', v('univer_dip'));
        fill('#dayout_dip', v('dayout_dip'));
        fill('#special_dip', v('special_dip'));
        fill('#number_dip', v('number_dip'));

        // ── Адреса (єДокумент) ───────────────────────────────────
        fill('#adress', v('adress') || v('bank_adress'));

        // ── Фото ─────────────────────────────────────────────────
        fillImg('#imgPassport', v('photo_passport'));
        fillImg('#imgRights',   v('photo_rights'));
        fillImg('#imgStudent',  v('photo_students'));
        fillImg('#imgZagran',   v('photo_zagran'));
    }

    // Запускаємо одразу (jQuery / values.js вже завантажені до цього файлу)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAll);
    } else {
        applyAll();
    }

    // Після повного завантаження — повторюємо, щоб перекрити дефолти
    window.addEventListener('load', function () {
        setTimeout(applyAll, 200);
    });

})();
