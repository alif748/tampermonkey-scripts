// ==UserScript==
// @name         YouTube - Speed Hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Map ; to 1.0x, [ to 1.25x, ] to 1.5x on YouTube
// @match        https://*.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const isEditable = (el) => {
        if (!el) return false;
        if (el.isContentEditable) return true;
        const tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    };

    const setRate = (rate) => {
        const video = document.querySelector('video');
        if (!video) return;
        video.playbackRate = rate; // 1.0 is normal speed
        showOverlay(rate);
    };

    let overlayTimeout;
    const showOverlay = (rate) => {
        let el = document.getElementById('tm-speed-overlay');
        if (!el) {
            el = document.createElement('div');
            el.id = 'tm-speed-overlay';
            Object.assign(el.style, {
                position: 'fixed',
                left: '50%',
                top: '20%',
                transform: 'translate(-50%, -50%)',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                font: 'bold 14px/1.2 sans-serif',
                zIndex: 2147483647,
                borderRadius: '6px',
                pointerEvents: 'none'
            });
            document.documentElement.appendChild(el);
        }
        el.textContent = `Speed: ${rate}x`;
        el.style.display = 'block';
        clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(() => {
            el.style.display = 'none';
        }, 1000);
    };

    window.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) return;
        const active = document.activeElement;
        if (isEditable(active)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        switch (e.code) {
            case 'Semicolon':
                setRate(1.0);
                e.preventDefault();
                e.stopPropagation();
                break;
            case 'BracketLeft':
                setRate(1.25);
                e.preventDefault();
                e.stopPropagation();
                break;
            case 'BracketRight':
                setRate(1.5);
                e.preventDefault();
                e.stopPropagation();
                break;
            default:
                break;
        }
    }, true);


})();