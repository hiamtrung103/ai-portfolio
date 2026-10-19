(() => {
  'use strict';
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('#theme-label');
  function updateTheme() {
    const dark = root.dataset.theme === 'dark';
    themeLabel.textContent = dark ? 'Dark' : 'Light';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#09121f' : '#f3f8ff';
  }
  updateTheme();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('trung-theme', root.dataset.theme); } catch (_) {}
    updateTheme();
    draw();
  });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project')];
  const count = document.querySelector('#filter-count');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; });
    count.textContent = `${String(projects.filter(project => !project.hidden).length).padStart(2, '0')} dự án`;
  }));
  const canvas = document.querySelector('#neural');
  const context = canvas.getContext('2d');
  if (!context) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.project-art').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType !== 'mouse') return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--rx', `${((event.clientY-bounds.top)/bounds.height-.5)*-9}deg`);
      card.style.setProperty('--ry', `${((event.clientX-bounds.left)/bounds.width-.5)*11}deg`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg'); });
  });
  const points = Array.from({length:128}, (_, i) => {
    const y = 1 - (i / 127) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = Math.PI * (3 - Math.sqrt(5)) * i;
    return { x:Math.cos(angle)*radius, y, z:Math.sin(angle)*radius };
  });
  let width = 0, height = 0, frame = 0, rotation = .3, visible = true;
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width; height = box.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  function draw() {
    context.clearRect(0,0,width,height);
    const radius = Math.min(width,height)*.30;
    const dark = root.dataset.theme === 'dark';
    const cx=width*.53,cy=height*.48;
    const color = dark ? '152,211,255' : '45,119,184';
    const shadow = context.createRadialGradient(cx,cy+radius*1.12,0,cx,cy+radius*1.12,radius*.95);
    shadow.addColorStop(0,dark?'rgba(0,8,24,.38)':'rgba(45,104,163,.18)');shadow.addColorStop(1,'rgba(45,104,163,0)');
    context.save();context.translate(0,(cy+radius*1.12)*.8);context.scale(1,.2);context.fillStyle=shadow;context.fillRect(0,0,width,height*6);context.restore();
    const glow=context.createRadialGradient(cx-radius*.35,cy-radius*.35,radius*.05,cx,cy,radius*1.04);
    glow.addColorStop(0,dark?'rgba(191,231,255,.24)':'rgba(255,255,255,.95)');
    glow.addColorStop(.45,dark?'rgba(72,145,216,.28)':'rgba(185,223,255,.5)');
    glow.addColorStop(.85,dark?'rgba(32,96,161,.35)':'rgba(96,164,221,.33)');
    glow.addColorStop(1,dark?'rgba(77,154,221,.06)':'rgba(157,206,248,.1)');
    context.fillStyle=glow;context.beginPath();context.arc(cx,cy,radius*1.04,0,Math.PI*2);context.fill();
    context.save();context.translate(cx,cy);context.rotate(-.4);context.strokeStyle=`rgba(${color},.25)`;context.lineWidth=.8;context.beginPath();context.ellipse(0,0,radius*1.34,radius*.46,0,0,Math.PI*2);context.stroke();context.restore();
    const projected = points.map(p => {
      const x = p.x*Math.cos(rotation) - p.z*Math.sin(rotation);
      const z = p.x*Math.sin(rotation) + p.z*Math.cos(rotation);
      const y = p.y*Math.cos(.27) - z*Math.sin(.27);
      const depth = p.y*Math.sin(.27) + z*Math.cos(.27);
      const perspective = 3/(3-depth*.25);
      return {x:cx+x*radius*perspective,y:cy+y*radius*perspective,z:depth};
    });
    for (let i=0;i<points.length;i++) for (let j=i+1;j<points.length;j++) {
      const distance = Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y,points[i].z-points[j].z);
      if (distance > .46) continue;
      const a=projected[i], b=projected[j];
      const opacity = .07+((a.z+b.z+2)/4)*.40;
      context.strokeStyle=`rgba(${color},${opacity})`; context.lineWidth=.7;
      context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
    }
    projected.sort((a,b)=>a.z-b.z).forEach((p,i) => {
      const alpha=.2+(p.z+1)*.36;
      context.fillStyle=`rgba(${color},${alpha})`;
      context.beginPath();context.arc(p.x,p.y,p.z>.6?2.4:1.2,0,Math.PI*2);context.fill();
      if (i%19===0 && p.z>0) { context.strokeStyle=`rgba(${color},.25)`;context.beginPath();context.arc(p.x,p.y,6,0,Math.PI*2);context.stroke(); }
    });
    context.fillStyle=dark?'#d3eeff':'#f5fcff';context.shadowColor=dark?'#91d2ff':'#76b9ef';context.shadowBlur=15;
    context.beginPath();context.arc(cx+Math.cos(rotation*1.5)*radius*1.26,cy+Math.sin(rotation*1.5)*radius*.57,4,0,Math.PI*2);context.fill();context.shadowBlur=0;
  }
  function animate() {
    frame=0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    rotation += .0025;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function resume() { if (frame) cancelAnimationFrame(frame); frame=0; draw(); if(visible&&!document.hidden&&!reducedMotion.matches) frame=requestAnimationFrame(animate); }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:0}).observe(canvas);
  document.addEventListener('visibilitychange',resume);
  reducedMotion.addEventListener('change',resume);
  resize();
})();
