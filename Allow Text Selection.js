// ==UserScript==
// @name            Allow Text Selection
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Force-enable text selection by overriding CSS, inline styles, stylesheet rules, and blocking JS handlers that prevent selection.
// @match           https://*/*
// @grant           none
// @run-at          document-start
// ==/UserScript==

(function () {
    'use strict';

    const injectGlobalStyle = () => {
        const id = 'tm-enable-userselect';
        if (document.getElementById(id)) return;
        const s = document.createElement('style');
        s.id = id;
        s.textContent = `* { -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important; }`;
        (document.head || document.documentElement).appendChild(s);
    };
    injectGlobalStyle();

    const normalizeInlineStyle = (el) => {
        if (!el || el.nodeType !== 1) return;
        try {
            const st = el.style;
            if (st) {
                if (st.userSelect && /none/i.test(st.userSelect)) st.userSelect = 'text';
                if (st.webkitUserSelect && /none/i.test(st.webkitUserSelect)) st.webkitUserSelect = 'text';
                if (st.MozUserSelect && /none/i.test(st.MozUserSelect)) st.MozUserSelect = 'text';
                if (st.msUserSelect && /none/i.test(st.msUserSelect)) st.msUserSelect = 'text';
            }
            const attr = el.getAttribute('style');
            if (attr && /user-select\s*:\s*none/i.test(attr)) {
                el.setAttribute('style', attr.replace(/user-select\s*:\s*none;?/ig, ''));
            }
        } catch (e) {}
    };

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'class')) normalizeInlineStyle(m.target);
            if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        normalizeInlineStyle(node);
                        try { node.querySelectorAll('*').forEach(normalizeInlineStyle); } catch (e) {}
                    }
                });
            }
        }
    });
    observer.observe(document.documentElement || document, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class'] });

    const patchStylesheets = () => {
        for (const ss of Array.from(document.styleSheets)) {
            try {
                const rules = ss.cssRules;
                if (!rules) continue;
                for (let i = 0; i < rules.length; i++) {
                    const r = rules[i];
                    if (r.type === CSSRule.STYLE_RULE) {
                        const style = r.style;
                        if (!style) continue;
                        const check = (prop) => {
                            const v = style.getPropertyValue(prop);
                            return v && /none/i.test(v);
                        };
                        if (check('user-select') || check('-webkit-user-select') || check('-moz-user-select') || check('-ms-user-select')) {
                            style.setProperty('user-select', 'text', 'important');
                            style.setProperty('-webkit-user-select', 'text', 'important');
                            style.setProperty('-moz-user-select', 'text', 'important');
                            style.setProperty('-ms-user-select', 'text', 'important');
                        }
                    }
                }
            } catch (e) {}
        }
    };

    patchStylesheets();
    const sheetObserver = new MutationObserver(patchStylesheets);
    sheetObserver.observe(document.documentElement || document, { childList: true, subtree: true });

    const allowEvents = ['selectstart', 'mousedown', 'mouseup', 'contextmenu', 'copy'];
    allowEvents.forEach(evt => {
        window.addEventListener(evt, function (e) {
            try { e.stopImmediatePropagation(); } catch (err) {}

        }, true);
    });


    try {
        document.querySelectorAll('*').forEach(normalizeInlineStyle);
    } catch (e) {}
})();
