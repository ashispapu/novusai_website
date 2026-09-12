/**
 * Niyan Enterprise AI Control Plane OS - Portal JS Logic
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
      paths: { private: { stroke: 'var(--accent-cyan)', width: '2.5', dash: '0' }, cloud: { stroke: 'var(--line-strong)', width: '1.5', dash: '4' }, edge: { stroke: 'var(--line-strong)', width: '1.5', dash: '4' } }
    },
    cloud: {
      title: "Active Configuration: Hybrid Failover API",
      body: "Leverages public hyperscale APIs (OpenAI, Claude, Gemini) for highly creative or unconstrained prompts. The system routes transit requests through a secure egress gateway with automated data scrubbing and masking filter arrays.",
      paths: { private: { stroke: 'var(--line-strong)', width: '1.5', dash: '4' }, cloud: { stroke: 'var(--accent-violet)', width: '2.5', dash: '0' }, edge: { stroke: 'var(--line-strong)', width: '1.5', dash: '4' } }
    },
    edge: {
      title: "Active Configuration: Local Edge Compute",
      body: "Deploys models directly on low-latency field machines (e.g. factory floor nodes, mobile devices, local offices). Automatically synchronizes weights and telemetry with the central control mesh when online.",
      paths: { private: { stroke: 'var(--line-strong)', width: '1.5', dash: '4' }, cloud: { stroke: 'var(--line-strong)', width: '1.5', dash: '4' }, edge: { stroke: 'var(--accent-pink)', width: '2.5', dash: '0' } }
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
      claudeCloud: ["Claude-3.5-Sonnet-Pro", "290 ms", "$6.00", "US-West Multi-Tenant"],
      geminiCloud: ["Gemini-1.5-Pro-Ultra", "240 ms", "$3.50", "Google Cloud VPC"]
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
      else if (scenario === 'competitor') complianceText = "[Policy] Corporate Intelligence Compliance Protocol & SEC regulations verified.";
      else complianceText = "[Policy] Multi-Framework Guard (GDPR, DPDP, HIPAA, NIST, SOC 2) initialized.";
    } else {
      complianceText = "[Policy] Bypassing compliance check. Running in unshielded dev mode.";
    }

    const logs = [
      `[Scanner] Analyzing prompt content metrics...`,
      `[Guard] Scanning request for prompt injection & jailbreak signatures...`,
      `[Guard] Verifying toxicity and language safety margins...`,
      sensitivity >= 2 ? `[Guard] Scrubbing potential PII leaks (names, numbers, API keys)...` : `[Guard] Basic PII screening completed.`,
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
        } else if (logs[step].includes('[Guard]')) {
          line.className = 'log-line text-violet';
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
        } else if (scenario === 'competitor') {
          selectedModel = routingEngineData.models.gptCloud;
          logsSuffix = `[Decision] Deep market intelligence query. Routed to OpenAI GPT-5 (with web search index).`;
        } else {
          selectedModel = routingEngineData.models.gptCloud;
          logsSuffix = `[Decision] Advanced analytics query. Routed to OpenAI GPT-5 pipeline.`;
        }
      } else if (budget === 2) {
        if (scenario === 'competitor') {
          selectedModel = routingEngineData.models.geminiCloud;
          logsSuffix = `[Decision] Balanced market intelligence query. Routed to Google Gemini-1.5-Pro.`;
        } else {
          selectedModel = routingEngineData.models.mistralHybrid;
          logsSuffix = `[Decision] Balanced performance constraint. Routed to Mistral Large hybrid cloud.`;
        }
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
    
    // Niyan AI cost comprises private token share + cloud fallback share + license overhead
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
          const key = 'niyan_leads';
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
     6. Enterprise AI Control Plane Tab Manager
     ========================================================================== */
  const cpTabs = document.querySelectorAll('.cp-tab-btn');
  const cpTag = document.getElementById('cp-tag');
  const cpTitle = document.getElementById('cp-title');
  const cpDesc = document.getElementById('cp-desc');
  const cpVisual = document.getElementById('cp-visual');
  const cpNotes = document.getElementById('cp-notes');

  const cpConfigurations = {
    eval: {
      tag: "Verification",
      title: "Model Evaluation Engine",
      description: "Run off-line evaluation benchmarks on customized datasets before deploying new private model weights.",
      visual: `
        <div class="eval-chart">
          <div class="eval-chart-bar" style="height: 94%" data-val="94%"></div>
          <div class="eval-chart-bar" style="height: 87%" data-val="87%"></div>
          <div class="eval-chart-bar" style="height: 91%" data-val="91%"></div>
          <div class="eval-chart-bar" style="height: 78%" data-val="78%"></div>
        </div>
        <div style="display: flex; justify-content: space-around; width: 100%;">
          <span class="eval-chart-label">Accuracy</span>
          <span class="eval-chart-label">Safety</span>
          <span class="eval-chart-label">Frugality</span>
          <span class="eval-chart-label">Latency</span>
        </div>
      `,
      notes: `
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>Custom Benchmarks</span></div>
          <div class="cp-note-body">Upload your industry test suites (MMLU, GSM8k, or private QA sheets) to run regression testing in seconds.</div>
        </div>
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>Drift Assessment</span></div>
          <div class="cp-note-body">Detect semantic drift in user prompt flows and compare live responses against target gold standards.</div>
        </div>
      `
    },
    deploy: {
      tag: "1-Click Launch",
      title: "Zero-Downtime Deployment Engine",
      description: "Launch production-grade sovereign AI endpoints inside private networks using unified, cloud-agnostic cluster scripts.",
      visual: `
        <div class="deploy-mesh-visual">
          <div class="mesh-node source">Dev</div>
          <div class="mesh-line"><span class="mesh-pulse"></span></div>
          <div class="mesh-node">Niyan</div>
          <div class="mesh-line"><span class="mesh-pulse"></span></div>
          <div class="mesh-node">Prod</div>
        </div>
      `,
      notes: `
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>1-Click Helm Deploy</span></div>
          <div class="cp-note-body">Deploy Niyan control plane containers directly inside your Kubernetes VPC or private cluster mesh using a unified script.</div>
        </div>
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>Model Registry Sync</span></div>
          <div class="cp-note-body">Connect directly with HuggingFace, private S3 buckets, or local file systems to synchronize custom weights on boot.</div>
        </div>
      `
    },
    scale: {
      tag: "GPU Autoscale",
      title: "Dynamic Resource Scaling Mesh",
      description: "Automatically scale model worker nodes down to zero during dry spells, and spin up dozens of GPUs when request volume spikes.",
      visual: `
        <div class="scale-clusters">
          <div class="cluster-dot active"></div>
          <div class="cluster-dot active"></div>
          <div class="cluster-dot active"></div>
          <div class="cluster-dot active"></div>
          <div class="cluster-dot active"></div>
          <div class="cluster-dot active scaling"></div>
          <div class="cluster-dot active scaling"></div>
          <div class="cluster-dot active scaling"></div>
          <div class="cluster-dot scaling"></div>
          <div class="cluster-dot scaling"></div>
          <div class="cluster-dot"></div>
          <div class="cluster-dot"></div>
          <div class="cluster-dot"></div>
          <div class="cluster-dot"></div>
          <div class="cluster-dot"></div>
          <div class="cluster-dot"></div>
        </div>
      `,
      notes: `
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>Scale-to-Zero Compute</span></div>
          <div class="cp-note-body">Reduce inactive server costs to zero. Spin down private SLM GPU resources dynamically when requests cease.</div>
        </div>
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>GPU Load Balancing</span></div>
          <div class="cp-note-body">Distribute prompts across heterogeneous GPU pools (A100, H100, L4, or local RTX nodes) for maximum hardware efficiency.</div>
        </div>
      `
    },
    observe: {
      tag: "Telemetry",
      title: "Observability & Tracing Suite",
      description: "Monitor exact prompt execution graphs, latency metrics, and API dollar expenditures with live, interactive tracing maps.",
      visual: `
        <div class="circular-gauge">
          <div class="gauge-value">
            <span id="gauge-percent">99.8%</span>
            <span class="gauge-label">Uptime</span>
          </div>
        </div>
      `,
      notes: `
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>Sub-Token Tracing</span></div>
          <div class="cp-note-body">Inspect deep prompt chains, multi-agent frameworks, and vector DB retrievals with microsecond tracking logs.</div>
        </div>
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>FinOps cost breakdown</span></div>
          <div class="cp-note-body">Track dollar expenditures across internal departments, APIs, and client application tokens from a central telemetry graph.</div>
        </div>
      `
    },
    govern: {
      tag: "Compliance",
      title: "Regulatory & Privacy Governance",
      description: "Ensure complete governance by setting corporate usage policies, automated audit trails, and client PII masking.",
      visual: `
        <div class="circular-gauge" style="background: conic-gradient(var(--accent-pink) 0deg 315deg, rgba(0, 0, 0, 0.06) 315deg 360deg)">
          <div class="gauge-value">
            <span id="gauge-percent">100%</span>
            <span class="gauge-label">PII Scrubbed</span>
          </div>
        </div>
      `,
      notes: `
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>PII Redaction Vault</span></div>
          <div class="cp-note-body">Scrub credit card numbers, personal emails, or telephone inputs before prompts transit across external clouds.</div>
        </div>
        <div class="cp-note-item">
          <div class="cp-note-title"><span class="cp-note-icon">✦</span><span>DPDP &amp; GDPR Checks</span></div>
          <div class="cp-note-body">Verify data residency rules. Restrict customer transactions to regional European or Indian sovereign servers.</div>
        </div>
      `
    }
  };

  cpTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      cpTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const configKey = tab.getAttribute('data-tab');
      const config = cpConfigurations[configKey];
      if (config) {
        cpTag.textContent = config.tag;
        cpTag.className = 'cp-display-tag'; // reset
        if (configKey === 'govern') {
          cpTag.classList.add('badge-danger');
        } else {
          cpTag.classList.add('badge-accent');
        }
        cpTitle.textContent = config.title;
        cpDesc.textContent = config.description;
        cpVisual.innerHTML = config.visual;
        cpNotes.innerHTML = config.notes;
      }
    });
  });

  /* ==========================================================================
     7. Deploy Command Widget Copy Manager
     ========================================================================== */
  const btnCopyDeploy = document.getElementById('btn-copy-deploy-cmd');
  const deployCmdText = document.getElementById('deploy-cmd-text');

  if (btnCopyDeploy && deployCmdText) {
    btnCopyDeploy.addEventListener('click', () => {
      navigator.clipboard.writeText(deployCmdText.textContent)
        .then(() => {
          const originalText = btnCopyDeploy.textContent;
          btnCopyDeploy.textContent = "✓ Copied!";
          setTimeout(() => {
            btnCopyDeploy.textContent = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
    });
  }

  /* ==========================================================================
     8. Insights Section Filter Controller
     ========================================================================== */
  const insightFilterBtns = document.querySelectorAll('.insights-tab-btn');
  const insightCards = document.querySelectorAll('.insight-card');

  insightFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      insightFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      insightCards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     9. Insights slide-over drawer
     ========================================================================== */
  const insightDrawerOverlay = document.getElementById('insight-drawer-overlay');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  
  const drawerCategory = document.getElementById('drawer-category');
  const drawerReadTime = document.getElementById('drawer-read-time');
  const drawerTitleText = document.getElementById('drawer-title-text');
  const drawerContentText = document.getElementById('drawer-content-text');

  const insightArticles = {
    'case-1': {
      category: "Case Study",
      readTime: "4 min read",
      title: "How a Leading National Bank Trimmed Token Spending by 74%",
      content: `
        <p><strong>Executive Summary</strong><br>A leading domestic bank managing retail credit products experienced exponential API token expenses with the rollout of customer support LLM bots. By deploying Niyan AI and running a hybrid model architecture, the bank reduced total third-party costs by 74% within 60 days.</p>
        
        <h3>The Challenge</h3>
        <p>Proprietary cloud engines (such as GPT-4o) were used to resolve simple user inquiries (e.g. "What is my account balance?"). While accurate, this resulted in an average price of $8.50 per million tokens. For a monthly volume of 450M tokens, this equaled $38,250 in API bills, along with strict compliance risks regarding exposure of credit records (PCI-DSS).</p>

        <blockquote>
          "We could not justify routing every simple balance lookup through global public APIs. We needed a secure, local orchestration gate."
        </blockquote>

        <h3>The Solution</h3>
        <p>The bank configured Niyan AI to operate as an intelligent routing endpoint. Niyan AI was hosted on-premise on private cluster nodes. 
        All customer prompts are analyzed by the Niyan AI Router. Routine inquiries are routed to private Llama-70B models running offline, costing $0.15/M tokens. Only complex legal audits or financial analysis are routed to cloud APIs after scrubbing PII.</p>

        <h3>Results</h3>
        <ul>
          <li><strong>74% decrease</strong> in monthly token billing.</li>
          <li><strong>Zero PII leaks</strong>: All personal credit card credentials redacted locally.</li>
          <li><strong>Sub-100ms latency</strong> for routine customer chats.</li>
        </ul>
      `
    },
    'blog-1': {
      category: "Blog Post",
      readTime: "6 min read",
      title: "Deploying Air-Gapped Private LLMs on Bare Metal DGX Nodes",
      content: `
        <p>Running enterprise AI workloads locally requires a highly optimized runtime compiler. In this developer guide, we cover the exact configuration script to stand up a private, air-gapped model using the Niyan CLI orchestrator.</p>

        <h3>Prerequisites</h3>
        <p>Ensure you have the following hardware dependencies installed:</p>
        <pre><code>- NVIDIA HGX/DGX Node (Minimum 4x H100 80GB GPUs)
- CUDA v12.2 + cuDNN v8.9
- Niyan CLI (v0.8.2-beta+)</code></pre>

        <h3>Step 1: Environment Initialization</h3>
        <p>Run the initialization setup. This will verify CUDA cores, locate storage vaults, and configure system clusters:</p>
        <pre><code>$ niyan init --airgapped --registry /mnt/vault/models</code></pre>

        <h3>Step 2: Compile Model Weights</h3>
        <p>Niyan compiles model weights into optimized TensorRT-LLM runtimes on boot. Run the following compile script to load Llama-3-Sovereign:</p>
        <pre><code>$ niyan compile --model llama-3-sovereign-70b --quantization FP8</code></pre>

        <h3>Step 3: Launch Local Endpoint</h3>
        <p>Spawn the OpenAI-compatible gateway. The server starts listening on localhost port 8080:</p>
        <pre><code>$ niyan deploy --env local --port 8080 --scale-min 2 --scale-max 4</code></pre>

        <h3>Conclusion</h3>
        <p>Your local developers can now swap their target OpenAI base URL to <code>http://localhost:8080/v1</code>. The Niyan AI Control Plane handles weight mapping, execution logs, and query scheduling automatically.</p>
      `
    },
    'case-2': {
      category: "Case Study",
      readTime: "5 min read",
      title: "Enforcing Strict HIPAA Data Guardrails in Healthcare AI",
      content: `
        <p><strong>Executive Summary</strong><br>A medical diagnostics provider successfully implemented generative AI agents for doctors' transcription notes while maintaining 100% compliance with HIPAA and SOC 2 security protocols using the Niyan AI Governance vault.</p>

        <h3>The Challenge</h3>
        <p>Clinical logs contain highly sensitive patient health details (PHI). Exposing this raw text to public API provider servers violates federal HIPAA regulations. However, local SLMs lacked the clinical terminology knowledge of advanced cloud models.</p>

        <h3>The Solution</h3>
        <p>The provider deployed Niyan AI as an active security buffer. When a transcription prompt is created:
        1. Niyan AI scans the text for PHI parameters (patient names, phone numbers, treatment IDs).
        2. Personal indicators are automatically replaced with anonymous tokens (e.g., [PATIENT_A_REDACTED]).
        3. The sanitized clinical description is routed to cloud models for processing.
        4. The response is received, and Niyan AI re-inserts the patient name locally before rendering to the physician's screen.</p>

        <h3>Outcomes</h3>
        <ul>
          <li><strong>100% compliant HIPAA pipeline</strong> audited by independent auditors.</li>
          <li><strong>Zero medical data stored</strong> outside the hospital firewall.</li>
          <li><strong>Accelerated deployment</strong>: Clinical transcription bot launched in 3 weeks instead of 9 months.</li>
        </ul>
      `
    }
  };

  insightCards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.getAttribute('data-id');
      const article = insightArticles[cardId];
      if (article) {
        drawerCategory.textContent = article.category;
        drawerReadTime.textContent = article.readTime;
        drawerTitleText.textContent = article.title;
        drawerContentText.innerHTML = article.content;

        insightDrawerOverlay.classList.add('active');
        insightDrawerOverlay.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeDrawer() {
    insightDrawerOverlay.classList.remove('active');
    insightDrawerOverlay.setAttribute('aria-hidden', 'true');
  }

  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
  
  if (insightDrawerOverlay) {
    insightDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === insightDrawerOverlay) {
        closeDrawer();
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

  /* Pause overview video when it leaves the viewport */
  const overviewVideo = document.getElementById('niyan-overview-video');
  if (overviewVideo) {
    const videoVisibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !overviewVideo.paused) {
          overviewVideo.pause();
        }
      });
    }, { threshold: 0.15 });
    videoVisibility.observe(overviewVideo);
  }

});
