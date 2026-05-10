"use strict";
// Typed, minimal enhancement layer for your portfolio.
// Build step is optional; script.js still works standalone.
const $ = (sel) => document.querySelector(sel);
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl)
        yearEl.textContent = String(new Date().getFullYear());
    const header = document.querySelector('.site-header');
    const update = () => {
        if (!header)
            return;
        const scrolled = window.scrollY > 8;
        header.toggleAttribute('data-elevate', scrolled);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    // Background animated particles (canvas)
    const existing = document.getElementById('bg-canvas');
    if (!existing) {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let w = 0;
        let h = 0;
        const resize = () => {
            w = canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
            h = canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);
        const dpr = window.devicePixelRatio || 1;
        const rand = (a, b) => a + Math.random() * (b - a);
        const colors = [
            'rgba(124,92,255,0.35)',
            'rgba(44,230,163,0.25)'
        ];
        const count = Math.max(35, Math.floor((window.innerWidth * window.innerHeight) / 45000));
        const dots = new Array(count).fill(0).map(() => ({
            x: rand(0, w),
            y: rand(0, h),
            r: rand(1.1, 2.8) * dpr,
            vx: rand(-0.12, 0.12) * dpr,
            vy: rand(-0.10, 0.10) * dpr,
            c: colors[Math.floor(Math.random() * colors.length)]
        }));
        const state = {
            mx: w / 2,
            my: h / 2,
            // normalized -1..1
            nx: 0,
            ny: 0,
            active: false
        };
        const onMove = (e) => {
            state.active = true;
            const x = e.clientX;
            const y = e.clientY;
            state.mx = x * dpr;
            state.my = y * dpr;
            state.nx = (x / Math.max(1, window.innerWidth)) * 2 - 1;
            state.ny = (y / Math.max(1, window.innerHeight)) * 2 - 1;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        let last = performance.now();
        const tick = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            // subtle fade to create trails
            ctx.fillStyle = 'rgba(11,18,32,0.18)';
            ctx.fillRect(0, 0, w, h);
            // cursor influence
            const cursorPull = state.active ? 0.18 : 0.06;
            const cursorR = Math.min(w, h) * 0.24;
            const cursorR2 = cursorR * cursorR;
            for (const dot of dots) {
                const dx = dot.x - state.mx;
                const dy = dot.y - state.my;
                const dist2 = dx * dx + dy * dy;
                if (dist2 < cursorR2) {
                    const dist = Math.sqrt(dist2) || 1;
                    // attract towards cursor with stronger effect when closer
                    const force = (1 - dist / cursorR) * cursorPull;
                    dot.vx += (-dx / dist) * force;
                    dot.vy += (-dy / dist) * force;
                }
                // drift reacts to cursor direction slightly
                dot.vx += state.nx * 0.004;
                dot.vy += state.ny * 0.004;
                // damping for smooth motion
                dot.vx *= 0.985;
                dot.vy *= 0.985;
                dot.x += dot.vx * (dt * 60);
                dot.y += dot.vy * (dt * 60);
                // wrap
                if (dot.x < -30)
                    dot.x = w + 30;
                if (dot.x > w + 30)
                    dot.x = -30;
                if (dot.y < -30)
                    dot.y = h + 30;
                if (dot.y > h + 30)
                    dot.y = -30;
                // draw dot
                ctx.beginPath();
                ctx.fillStyle = dot.c;
                ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
                ctx.fill();
                // connect lines for a more dynamic feel (local neighborhood)
                // keep it lightweight by only checking a few nearest by sampling.
            }
            // draw connecting lines (O(n^2) avoided by sampling)
            const sampleStep = Math.max(1, Math.floor(dots.length / 80));
            ctx.lineWidth = 1 * dpr;
            for (let i = 0; i < dots.length; i += sampleStep) {
                for (let j = i + sampleStep; j < dots.length; j += sampleStep) {
                    const a = dots[i];
                    const b = dots[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    const max = 120 * dpr;
                    if (d2 < max * max) {
                        const alpha = (1 - d2 / (max * max)) * 0.35;
                        ctx.strokeStyle = `rgba(124,92,255,${alpha.toFixed(3)})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(tick);
        };
        // initial paint
        ctx.fillStyle = 'rgba(11,18,32,1)';
        ctx.fillRect(0, 0, w, h);
        requestAnimationFrame(tick);
    }
    // Optional typed integration with modal buttons
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalStack = document.getElementById('modalStack');
    const modalLinks = document.getElementById('modalLinks');
    const modal = document.getElementById('projectModal');
    if (modalTitle && modalDesc && modalStack && modalLinks && modal) {
        const open = (btn) => {
            modalTitle.textContent = btn.dataset.projectTitle || 'Project';
            modalDesc.textContent = btn.dataset.projectDesc || '';
            modalStack.textContent = btn.dataset.projectStack || '';
            modalLinks.textContent = btn.dataset.projectLinks || '';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        document.querySelectorAll('.project__details').forEach(el => {
            const btn = el;
            btn.addEventListener('click', () => open(btn));
        });
        document.querySelectorAll('[data-close="true"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });
    }
});
