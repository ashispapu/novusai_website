/**
 * Novus Enterprise AI Runtime OS - Portal JS Logic
 * Contains interactive widgets, SVG visualizers, ROI formulas, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Architecture Visualizer Toggle
     ========================================================================== */
  const archTabs = document.querySelectorAll('.arch-tab-btn');
  const archTitle = document.getElementById('arch-title-text');
  const archBody = document.getElementById('arch-body-text');
  
  // SVG paths
  const pathPrivate = document.getElementById('path-private');
  const pathCloud = document.getElementById('path-cloud');
  const pathEdge = document.getElementById('path-edge');
  
  const archConfigurations = {
    private: {
      title: "Active Configuration: Private Sovereign Cloud",
      body: "Requests are run inside a private server enclosure or dedicated Kubernetes node. Zero training or inference data travels outside the corporate firewall. Compliant with military, BFSI, and strict national privacy mandates.",
      paths: { private: { stroke: '#00f2fe', width: '3', dash: '0' }, cloud: { stroke: 'rgba(255,255,255,0.1)', width: '1.5', dash: '4' }, edge: { stroke: 'rgba(255,255,255,0.1)', width: '1.5', dash: '4' } }
    },
    cloud: {
      title: "Active Configuration: Hybrid Failover API",
      body: "Leverages public hyperscale APIs (OpenAI, Claude, Gemini) for highly creative or unconstrained prompts. The system routes transit requests through a secure egress gateway with automated data scrubbing and masking filter arrays.",
      paths: { private: { stroke: 'rgba(255,255,255,0.1)', width: '1.5', dash: '4' }, cloud: { stroke: '#7f00ff', width: '3', dash: '0' }, edge: { stroke: 'rgba(255,255,255,0.1)', width: '1.5', dash: '4' } }
    },
    edge: {
      title: "Active Configuration: Local Edge Compute",
      body: "Deploys models directly on low-latency field machines (e.g. factory floor nodes, mobile devices, local offices). Automatically synchronizes weights and telemetry with the central control mesh when online.",
      paths: { private: { stroke: 'rgba(255,255,255,0.1)', width: '1.5', dash: '4' }, cloud: { stroke: 'rgba(255,255,255,0.1)', width: '1.5', dash: '4' }, edge: { stroke: '#f857a6', width: '3', dash: '0' } }
    }
  };

  function applyArchState(type) {
    const config = archConfigurations[type];
    if (!config) return;
    
    // Update copy
    archTitle.textContent = config.title;
    archBody.textContent = config.body;
    
    // Update SVG styles
    if (pathPrivate && pathCloud && pathEdge) {
      pathPrivate.setAttribute('stroke', config.paths.private.stroke);
      pathPrivate.setAttribute('stroke-width', config.paths.private.width);
      pathPrivate.setAttribute('stroke-dasharray', config.paths.private.dash);
      
      pathCloud.setAttribute('stroke', config.paths.cloud.stroke);
      pathCloud.setAttribute('stroke-width', config.paths.cloud.width);
      pathCloud.setAttribute('stroke-dasharray', config.paths.cloud.dash);
      
      pathEdge.setAttribute('stroke', config.paths.edge.stroke);
      pathEdge.setAttribute('stroke-width', config.paths.edge.width);
      pathEdge.setAttribute('stroke-dasharray', config.paths.edge.dash);
    }
  }

  archTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Toggle active tab styling
      archTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const type = tab.getAttribute('data-type');
      applyArchState(type);
    });
  });

  // Initialize visualizer state
  applyArchState('private');


  /* ==========================================================================
     2. Intelligent AI Router Simulator
     ========================================================================== */
  const querySelect = document.getElementById('query-select');
  const sensitivitySlider = document.getElementById('sensitivity-slider');
  const sensitivityVal = document.getElementById('sensitivity-val');
  const budgetSlider = document.getElementById('budget-slider');
  const budgetVal = document.getElementById('budget-val');
  const complianceChk = document.getElementById('compliance-chk');
  const btnRoute = document.getElementById('btn-simulate-route');
  
  const consoleLogs = document.getElementById('console-logs');
  const routedModelName = document.getElementById('routed-model-name');
  const statLatency = document.getElementById('stat-latency');
  const statCost = document.getElementById('stat-cost');
  const statCompliance = document.getElementById('stat-compliance');
  const statStorage = document.getElementById('stat-storage');

  // Control labels updates
  sensitivitySlider.addEventListener('input', () => {
    const val = parseInt(sensitivitySlider.value);
    if (val === 1) sensitivityVal.textContent = "Public / Unclassified";
    else if (val === 2) sensitivityVal.textContent = "Internal Use Only";
    else sensitivityVal.textContent = "Classified / Restricted PII";
  });

  budgetSlider.addEventListener('input', () => {
    const val = parseInt(budgetSlider.value);
    if (val === 1) budgetVal.textContent = "Cost Savings Primary";
    else if (val === 2) budgetVal.textContent = "Balanced Performance";
    else budgetVal.textContent = "Highest Accuracy Focus";
  });

  // Simulator mappings
  const routingEngineData = {
    // Model format: [Name, Latency, Cost, Storage, LogText]
    models: {
      llamaLocal: ["Llama-4-Sovereign-70B", "180 ms", "$0.15", "Private HSM Vault"],
      qwenEdge: ["Qwen-2.5-Edge-32B", "95 ms", "$0.08", "Local Edge Node"],
      mistralHybrid: ["Mistral-Large-Hybrid", "220 ms", "$1.20", "Secure Private VPC"],
      gptCloud: ["GPT-5-Enterprise", "340 ms", "$9.50", "US-East Encrypted API"],
      claudeCloud: ["Claude-3.5-Sonnet-Pro", "290 ms", "$6.00", "US-West Multi-Tenant"]
    }
  };

  btnRoute.addEventListener('click', () => {
    btnRoute.disabled = true;
    btnRoute.textContent = "Routing...";
    
    const scenario = querySelect.value;
    const sensitivity = parseInt(sensitivitySlider.value);
    const budget = parseInt(budgetSlider.value);
    const compliance = complianceChk.checked;
    
    // Clear logs
    consoleLogs.innerHTML = `<div class="log-line text-cyan">[System] Initializing Routing Pipeline for scenario '${scenario}'...</div>`;
    
    let step = 0;
    
    // Choose correct compliance frame name for logs
    let complianceText = "[Policy] Basic compliance mapping enabled.";
    if (compliance) {
      if (scenario === 'clinical') complianceText = "[Policy] HIPAA & HITECH Health privacy shield initialized (Strict Compliance Mode).";
      else if (scenario === 'billing') complianceText = "[Policy] SOC 2 Type II & PCI-DSS audit trails initialized (Strict Compliance Mode).";
      else if (scenario === 'translation') complianceText = "[Policy] GDPR & India DPDP Act cross-border validation constraints initialized (Strict Compliance Mode).";
      else if (scenario === 'support') complianceText = "[Policy] NIST AI Risk Management controls initialized (Strict Compliance Mode).";
      else complianceText = "[Policy] Multi-Framework Guard (GDPR, DPDP, HIPAA, NIST, SOC 2) initialized.";
    } else {
      complianceText = "[Policy] Bypassing compliance check. Running in unshielded dev mode.";
    }

    const logs = [
      `[Scanner] Analyzing prompt content metrics...`,
      complianceText,
      `[Compliance] Data Sensitivity rating detected: ${sensitivity === 3 ? "HIGH" : sensitivity === 2 ? "MEDIUM" : "LOW"}.`,
      `[Optimizer] Fetching GPU resource telemetry from cluster endpoints...`,
      `[Router] Evaluating routing constraints: budget priority ${budget === 3 ? "ACCURACY" : budget === 2 ? "BALANCED" : "COST"}.`
    ];

    const timer = setInterval(() => {
      if (step < logs.length) {
        const line = document.createElement('div');
        line.className = 'log-line';
        if (logs[step].includes('Compliance') || logs[step].includes('GDPR') || logs[step].includes('Policy') || logs[step].includes('HIPAA') || logs[step].includes('DPDP') || logs[step].includes('SOC') || logs[step].includes('NIST')) {
          line.className = 'log-line text-green';
        }
        line.textContent = logs[step];
        consoleLogs.appendChild(line);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
        step++;
      } else {
        clearInterval(timer);
        concludeRouting(scenario, sensitivity, budget, compliance);
      }
    }, 350);
  });

  function concludeRouting(scenario, sensitivity, budget, compliance) {
    let selectedModel = routingEngineData.models.llamaLocal; // default
    let logsSuffix = "";

    // Decision Logic Tree
    if (sensitivity === 3) {
      // High sensitivity must go local/private
      if (scenario === 'clinical') {
        selectedModel = routingEngineData.models.llamaLocal;
        logsSuffix = `[Decision] Crucial Healthcare PHI detected. Enforced Private On-Prem Sovereign Node.`;
      } else if (scenario === 'billing' || scenario === 'support') {
        selectedModel = routingEngineData.models.llamaLocal;
        logsSuffix = `[Decision] PII credentials isolated. Routed to internal audit vault.`;
      } else {
        selectedModel = routingEngineData.models.llamaLocal;
        logsSuffix = `[Decision] Restricted sensitivity rule applied. Public cloud APIs forbidden.`;
      }
    } else if (sensitivity === 2) {
      // Medium sensitivity
      if (budget === 1) {
        selectedModel = routingEngineData.models.qwenEdge;
        logsSuffix = `[Decision] Internal query with economy focus. Routed to local GPU cluster.`;
      } else if (budget === 3) {
        selectedModel = routingEngineData.models.mistralHybrid;
        logsSuffix = `[Decision] Accuracy prioritised for internal document task. VPC hybrid routed.`;
      } else {
        selectedModel = routingEngineData.models.llamaLocal;
        logsSuffix = `[Decision] Standard internal task. Routed to default Llama-70B gateway.`;
      }
    } else {
      // Low sensitivity - public cloud endpoints allowed
      if (budget === 3) {
        if (scenario === 'marketing') {
          selectedModel = routingEngineData.models.claudeCloud;
          logsSuffix = `[Decision] High creative accuracy required. Routed to Anthropic Claude 3.5.`;
        } else {
          selectedModel = routingEngineData.models.gptCloud;
          logsSuffix = `[Decision] Advanced analytics query. Routed to OpenAI GPT-5 pipeline.`;
        }
      } else if (budget === 2) {
        selectedModel = routingEngineData.models.mistralHybrid;
        logsSuffix = `[Decision] Balanced performance constraint. Routed to Mistral Large hybrid cloud.`;
      } else {
        selectedModel = routingEngineData.models.qwenEdge;
        logsSuffix = `[Decision] Cost-saving override. Routed to local edge infrastructure.`;
      }
    }

    // Append Final Decision log
    const decLine = document.createElement('div');
    decLine.className = 'log-line text-cyan';
    decLine.textContent = logsSuffix;
    consoleLogs.appendChild(decLine);

    const succLine = document.createElement('div');
    succLine.className = 'log-line text-green';
    succLine.textContent = `[Success] Output successfully generated by model ${selectedModel[0]}.`;
    consoleLogs.appendChild(succLine);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;

    // Display values
    routedModelName.textContent = selectedModel[0];
    statLatency.textContent = selectedModel[1];
    statCost.textContent = selectedModel[2];
    statCompliance.textContent = compliance ? "ENFORCED" : "PASSED";
    statStorage.textContent = selectedModel[3];

    // Re-enable button
    btnRoute.disabled = false;
    btnRoute.textContent = "Route Request";
  }


  /* ==========================================================================
     3. ROI Savings Calculator
     ========================================================================== */
  const tokensInput = document.getElementById('monthly-tokens');
  const priceInput = document.getElementById('avg-cloud-price');
  const ratioSlider = document.getElementById('private-ratio');
  const ratioVal = document.getElementById('ratio-slider-val');
  
  const calcSavings = document.getElementById('calc-annual-savings');
  const calcCurrent = document.getElementById('calc-current-cost');
  const calcNovus = document.getElementById('calc-novus-cost');
  const calcPayback = document.getElementById('calc-payback');
  
  const barCurrent = document.getElementById('bar-current');
  const barNovus = document.getElementById('bar-novus');
  const legendCurrent = document.getElementById('legend-current');
  const legendNovus = document.getElementById('legend-novus');

  const PRIVATE_COST_PER_MILLION = 0.15; // static cost for local nodes inference
  const MOCK_PLATFORM_OVERHEAD = 1200;   // annual licensing cost proxy

  function calculateROI() {
    const monthlyTokens = parseFloat(tokensInput.value) || 0;
    const avgCloudPrice = parseFloat(priceInput.value) || 0;
    const privateRatio = parseInt(ratioSlider.value) / 100;
    
    if (monthlyTokens <= 0 || avgCloudPrice <= 0) {
      calcSavings.textContent = "$0";
      calcCurrent.textContent = "$0";
      calcNovus.textContent = "$0";
      calcPayback.textContent = "0.0 Months";
      return;
    }

    // Ratio display update
    const pctPrivate = Math.round(privateRatio * 100);
    const pctCloud = 100 - pctPrivate;
    ratioVal.textContent = `${pctPrivate}% Private / ${pctCloud}% Cloud Fallback`;

    // Formulas
    const currentAnnualCost = monthlyTokens * avgCloudPrice * 12;
    
    // Novus cost comprises private token share + cloud fallback share + license overhead
    const privateShareCost = (monthlyTokens * privateRatio) * PRIVATE_COST_PER_MILLION * 12;
    const cloudShareCost = (monthlyTokens * (1 - privateRatio)) * avgCloudPrice * 12;
    const novusAnnualCost = privateShareCost + cloudShareCost + MOCK_PLATFORM_OVERHEAD;
    
    const annualSavings = Math.max(0, currentAnnualCost - novusAnnualCost);
    
    // Payback in months = overhead / (monthly savings)
    const monthlySavings = annualSavings / 12;
    const paybackMonths = monthlySavings > 0 ? (MOCK_PLATFORM_OVERHEAD / monthlySavings) : 0;
    
    // Update text content
    calcSavings.textContent = formatCurrency(annualSavings);
    calcCurrent.textContent = formatCurrency(currentAnnualCost);
    calcNovus.textContent = formatCurrency(novusAnnualCost);
    calcPayback.textContent = paybackMonths > 0 ? `${paybackMonths.toFixed(1)} Months` : "Instant";

    // Chart representation heights
    const maxCost = Math.max(currentAnnualCost, novusAnnualCost, 1);
    const currentPct = (currentAnnualCost / maxCost) * 100;
    const novusPct = (novusAnnualCost / maxCost) * 100;
    
    barCurrent.style.height = `${Math.max(5, currentPct)}%`;
    barNovus.style.height = `${Math.max(5, novusPct)}%`;
    
    legendCurrent.textContent = formatAbbreviated(currentAnnualCost);
    legendNovus.textContent = formatAbbreviated(novusAnnualCost);
  }

  function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  }

  function formatAbbreviated(num) {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
    return `$${num.toFixed(0)}`;
  }

  // Bind Event Listeners
  tokensInput.addEventListener('input', calculateROI);
  priceInput.addEventListener('input', calculateROI);
  ratioSlider.addEventListener('input', calculateROI);

  // Initialize Calculator
  calculateROI();


  /* ==========================================================================
     4. Beta Registration Form & Modal handling
     ========================================================================== */
  const betaForm = document.getElementById('beta-registration-form');
  const successModal = document.getElementById('success-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnDismissModal = document.getElementById('btn-dismiss-modal');
  const submitButton = document.getElementById('btn-form-submit');

  if (betaForm) {
    betaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform validation
      if (!betaForm.checkValidity()) {
        betaForm.reportValidity();
        return;
      }

      // Check consent explicitly
      const consentChk = document.getElementById('form-consent');
      if (!consentChk.checked) {
        alert("Consent is required to submit the registration form.");
        return;
      }
      
      // Submit Visual State
      submitButton.disabled = true;
      submitButton.textContent = "Processing details...";
      
      // Simulate API registration delay
      setTimeout(() => {
        // Collect form data for Mock Storage
        const formData = new FormData(betaForm);
        const lead = {
          name: formData.get('fullname'),
          email: formData.get('email'),
          company: formData.get('company'),
          industry: formData.get('industry'),
          deployment: formData.get('deployment'),
          spend: formData.get('spend'),
          timestamp: new Date().toISOString()
        };
        
        // Save to LocalStorage for review
        try {
          const key = 'novus_leads';
          const existingLeads = JSON.parse(localStorage.getItem(key)) || [];
          existingLeads.push(lead);
          localStorage.setItem(key, JSON.stringify(existingLeads));
        } catch (err) {
          console.warn("Storage permission denied, skipping localStorage cache.");
        }
        
        // Display Modal
        successModal.classList.add('active');
        successModal.setAttribute('aria-hidden', 'false');
        
        // Reset Form elements
        betaForm.reset();
        submitButton.disabled = false;
        submitButton.textContent = "Submit Registration";
      }, 1500);
    });
  }

  function closeModal() {
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnDismissModal) btnDismissModal.addEventListener('click', closeModal);
  
  // Close on outer overlay click
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeModal();
      }
    });
  }


  /* ==========================================================================
     5. Scroll-Driven Animation Fallbacks (IntersectionObserver)
     ========================================================================== */
  // Checks if CSS View Timelines is unsupported
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const options = {
      root: null, // viewport
      threshold: 0.15 // trigger when 15% visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Unobserve to keep state static after reveal
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Apply inline reset style variables for elements intended to animate
    const animElements = document.querySelectorAll('.feature-card, .sector-card, .router-card, .calculator-card');
    
    animElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      scrollObserver.observe(el);
    });
  }

});
