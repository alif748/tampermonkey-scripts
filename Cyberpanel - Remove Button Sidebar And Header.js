// ==UserScript==
// @name         Cyberpanel - Remove Button Sidebar And Header
// @namespace    http://tampermonkey.net/
// @version      2025-11-11
// @description  Remove sidebar items and header sections
// @author       Alif
// @include      https://*:8090/*
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("#sidebar a").forEach((x, y) => {
        //GM_log(x.innerText.trim()+y)
    })

    const inputRemoveSidebar = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,34,35,36,37,38,44,45,46,47,48,49,50,52,53,54,55,56,57,58,59,60,61,62,63,64,65,67,71,74,75,76,78,81,82, 83, 84,85,86,87,88,121,122,123,124,125,126,127";

    function removeSidebar(raw) {
        const indexes = raw.split(",").map(x => Number(x.trim()));
        const links = document.querySelectorAll("#sidebar a");
        indexes.forEach(i => {
            const el = links[i];
            if (el) el.remove();
        });
    }

    const headerTargets = ["header", "backup-notification", "ai-scanner-notification"];
    headerTargets.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    const main = document.getElementById("main-content");
    if (main) main.style.padding = "0";

    removeSidebar(inputRemoveSidebar);
})();
