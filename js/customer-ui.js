
(async function(){
  const $ = (id) => document.getElementById(id);

  function nl2br(text){ return String(text || '').replace(/\n/g, '<br>'); }

  function renderSettings(s){
    $('doc-title').textContent = `${s.shop_name} — ${s.tagline}`;
    $('hero-headline').innerHTML = s.hero_headline;
    $('hero-sub').textContent = s.hero_sub;
    $('about-heading').innerHTML = s.about_heading;
    $('about-body').innerHTML = nl2br(s.about_body);
    $('ct-address').textContent = s.address;
    $('ct-phone').textContent = s.phone;
    $('ct-email').textContent = s.email;
    $('ct-hours').textContent = `${s.hours_weekday} · ${s.hours_weekend}`;
    $('diag-warning').textContent = s.diagnostics_warning;
    $('diag-tool').style.display = s.diagnostics_enabled ? '' : 'none';
    $('diag-disabled').style.display = s.diagnostics_enabled ? 'none' : '';
    $('footer-copy').textContent = `© ${new Date().getFullYear()} ${s.shop_name}. All rights reserved.`;
  }

  function renderServices(services){
    const wrap = $('svc-grid-home');
    wrap.innerHTML = services.map(s => `
      <article class="svc-card">
        <div class="svc-icon">${s.icon || '🔧'}</div>
        <div class="svc-name">${s.name}</div>
        <div class="svc-desc">${s.description || ''}</div>
        <div class="svc-meta">${s.duration || ''}${s.price_range ? ` • ${s.price_range}` : ''}</div>
      </article>
    `).join('');
  }

  function renderPosts(posts){
    const wrap = $('post-grid');
    wrap.innerHTML = posts.map(p => `
      <article class="post-card">
        <div class="post-cat">${p.category}</div>
        <div class="post-title">${p.title}</div>
        <div class="post-body">${p.content || ''}</div>
      </article>
    `).join('');
  }

  async function refresh(){
    try {
      const [settings, services, posts] = await Promise.all([
        window.TireGuyCustomerData.getSiteSettings(),
        window.TireGuyCustomerData.getServices(),
        window.TireGuyCustomerData.getPosts()
      ]);
      renderSettings(settings);
      renderServices(services);
      renderPosts(posts);
    } catch (err) {
      console.error(err);
      $('status-msg').textContent = 'Unable to load live website data right now.';
    }
  }

  $('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: $('cf-name').value.trim(),
      email: $('cf-email').value.trim(),
      phone: $('cf-phone').value.trim(),
      message: $('cf-message').value.trim()
    };
    if(!payload.name || !payload.message){
      $('status-msg').textContent = 'Please enter your name and message.';
      return;
    }
    try {
      await window.TireGuyCustomerData.submitContact(payload);
      e.target.reset();
      $('status-msg').textContent = 'Message sent. We will get back to you soon.';
    } catch (err) {
      $('status-msg').textContent = err.message || 'Message failed to send.';
    }
  });

  $('diag-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      customer_name: $('dg-name').value.trim(),
      vehicle: $('dg-vehicle').value.trim(),
      mileage: $('dg-mileage').value.trim(),
      symptoms: $('dg-symptoms').value.trim(),
      extra: $('dg-extra').value.trim()
    };
    if(!payload.symptoms){
      $('diag-result').textContent = 'Please describe the symptoms first.';
      return;
    }
    const result = window.TireGuyDiagnostics.analyze(payload);
    $('diag-result').textContent = result;
    try { await window.TireGuyCustomerData.logDiagnostic({ ...payload, result }); } catch (err) { console.error(err); }
  });

  window.TireGuyCustomerData.subscribe(() => refresh());
  refresh();
})();
