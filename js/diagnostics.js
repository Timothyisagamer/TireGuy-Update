
window.TireGuyDiagnostics = (() => {
  function analyze({vehicle, mileage, symptoms, extra}){
    const text = `${vehicle} ${mileage} ${symptoms} ${extra}`.toLowerCase();
    const findings = [];
    if(/brake|squeal|grind/.test(text)) findings.push('Brake pads or rotors may be worn and should be inspected soon.');
    if(/pull|alignment|vibration|shake/.test(text)) findings.push('Alignment, tire balance, or suspension components may need inspection.');
    if(/overheat|coolant|temperature/.test(text)) findings.push('Cooling system issues may be present. Check coolant, thermostat, and leaks.');
    if(/oil|leak/.test(text)) findings.push('An oil leak or low oil condition may be present. Verify oil level and inspect seals.');
    if(/start|battery|dead/.test(text)) findings.push('Battery, starter, or charging system testing is recommended.');
    if(!findings.length) findings.push('A full hands-on inspection is recommended to confirm the root cause.');

    const severity = /overheat|brake|grind|smoke/.test(text) ? 'High' : /vibration|pull|battery|start/.test(text) ? 'Medium' : 'Low';
    const safe = severity === 'High' ? 'Drive only with caution, and schedule service immediately.' : 'Likely drivable with caution, but inspection is recommended soon.';

    return [
      `Most likely causes:\n- ${findings.join('\n- ')}`,
      `\nSeverity: ${severity}`,
      `\nRecommended next step: Schedule a professional inspection to confirm the issue before repairs.`,
      `\nSafe to drive: ${safe}`
    ].join('\n');
  }
  return { analyze };
})();
