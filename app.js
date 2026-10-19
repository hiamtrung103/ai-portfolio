(() => {
  'use strict';
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
    const radius = Math.min(width,height)*.34;
    const projected = points.map(p => {
      const x = p.x*Math.cos(rotation) - p.z*Math.sin(rotation);
      const z = p.x*Math.sin(rotation) + p.z*Math.cos(rotation);
      const y = p.y*Math.cos(.27) - z*Math.sin(.27);
      const depth = p.y*Math.sin(.27) + z*Math.cos(.27);
      const perspective = 3/(3-depth*.25);
      return {x:width*.53+x*radius*perspective,y:height*.5+y*radius*perspective,z:depth};
    });
    for (let i=0;i<points.length;i++) for (let j=i+1;j<points.length;j++) {
      const distance = Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y,points[i].z-points[j].z);
      if (distance > .46) continue;
      const a=projected[i], b=projected[j];
      const opacity = .05+((a.z+b.z+2)/4)*.28;
      context.strokeStyle=`rgba(181,226,135,${opacity})`; context.lineWidth=.6;
      context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
    }
    projected.sort((a,b)=>a.z-b.z).forEach((p,i) => {
      const alpha=.2+(p.z+1)*.36;
      context.fillStyle=`rgba(204,248,157,${alpha})`;
      context.beginPath();context.arc(p.x,p.y,p.z>.6?2.4:1.2,0,Math.PI*2);context.fill();
      if (i%19===0 && p.z>0) { context.strokeStyle='rgba(198,242,139,.18)';context.beginPath();context.arc(p.x,p.y,6,0,Math.PI*2);context.stroke(); }
    });
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
