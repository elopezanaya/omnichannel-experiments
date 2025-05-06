const loadOmnichannelConfig = (cpsbotId: string) => {
  const omnichannelConfig = { // Default config
    orgId: import.meta.env.VITE_ORG_ID || '',
    orgUrl: import.meta.env.VITE_ORG_URL || '',
    widgetId: import.meta.env.VITE_WIDGET_ID || '',
    cpsBotId: import.meta.env.VITE_CPS_BOT_ID || ''

  };

  // Overrides default config if URL any param is found
  
    omnichannelConfig.orgUrl = import.meta.env.VITE_ORG_URL || ''; // ORG_URL || '';
    omnichannelConfig.orgId = import.meta.env.VITE_ORG_ID || ''; // ORGID
    omnichannelConfig.widgetId = import.meta.env.VITE_WIDGET_ID || ''; // WIDGETID
  
    if(cpsbotId.trim() !== '') {
    omnichannelConfig.cpsBotId = cpsbotId;
  }

  return omnichannelConfig;
}

export default loadOmnichannelConfig;

