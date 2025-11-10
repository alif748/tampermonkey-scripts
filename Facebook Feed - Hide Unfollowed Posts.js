// ==UserScript==
// @name         Facebook Feed: Hide Unfollowed Posts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide Facebook feed posts that show Follow or Join.
// @match        https://www.facebook.com/
// @match        https://m.facebook.com/
// @grant        none
// @run-at       document-idle
// ==/UserScript==


(function() {
    const hide = (node) => {
        if (!node || node.nodeType !== 1) return;
        if (node.tagName !== "SPAN") return;

        const t = node.textContent;
        if (t !== "Follow" && t !== "Join") return;

        let p = node;
        for (let i = 0; i < 26; i++) {
            if (!p.parentNode) break;
            p = p.parentNode;
        }

        p.style.display = "none";
    };

    const scanNode = (n) => {
        if (!n) return;
        if (n.nodeType === 1) {
            if (n.tagName === "SPAN") hide(n);
            const kids = n.querySelectorAll("span");
            for (const k of kids) hide(k);
        }
    };

    const obs = new MutationObserver((m) => {
        for (const r of m) {
            for (const n of r.addedNodes) scanNode(n);
        }
    });

    obs.observe(document, { subtree: true, childList: true });
})();