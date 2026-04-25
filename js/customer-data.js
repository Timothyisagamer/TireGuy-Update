
window.TireGuyCustomerData = (() => {
  let client;
  function db(){
    if(!client) client = window.createTireGuySupabaseClient();
    return client;
  }

  async function getSiteSettings(){
    const { data, error } = await db().from('site_settings').select('*').eq('id',1).single();
    if(error) throw error;
    return data;
  }

  async function getServices(){
    const { data, error } = await db().from('services').select('*').eq('active', true).order('sort_order');
    if(error) throw error;
    return data || [];
  }

  async function getPosts(){
    const { data, error } = await db().from('community_posts').select('*').eq('active', true).order('pinned', {ascending:false}).order('created_at', {ascending:false}).limit(6);
    if(error) throw error;
    return data || [];
  }

  async function submitContact(payload){
    const { error } = await db().from('contact_inquiries').insert(payload);
    if(error) throw error;
  }

  async function logDiagnostic(payload){
    const { error } = await db().from('diagnostics_logs').insert({ ...payload, source: 'customer' });
    if(error) throw error;
  }

  function subscribe(onChange){
    return db().channel('tireguy-public-live')
      .on('postgres_changes', { event:'*', schema:'public', table:'site_settings' }, onChange)
      .on('postgres_changes', { event:'*', schema:'public', table:'services' }, onChange)
      .on('postgres_changes', { event:'*', schema:'public', table:'community_posts' }, onChange)
      .subscribe();
  }

  return { getSiteSettings, getServices, getPosts, submitContact, logDiagnostic, subscribe };
})();
