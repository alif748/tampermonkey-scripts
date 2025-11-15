// ==UserScript==
// @name         CyberPanel - Quick Website Actions
// @namespace    http://tampermonkey.net/
// @version      2025-10-30
// @description  Center quick actions and remove default button
// @author       You
// @include      https://*:8090/websites/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('.quick-actions').style.justifyContent = 'center'

    document.querySelector('.action-group>button').remove()
})();