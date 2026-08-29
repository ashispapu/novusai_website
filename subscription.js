/**
 * Subscription page — VM vs Kubernetes plan selection and post-subscribe install steps.
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'niyan_vm_subscription';

  const INSTALL_COMMANDS = [
    "# 1) Log in to GHCR (from invite email — NOT on public website)",
    "echo '<READ_ONLY_PAT>' | docker login ghcr.io -u <GITHUB_USER> --password-stdin",
    "",
    "# 2) Install (small download from your site)",
    "export NIYAN_BUNDLE_URL='https://yourwebsite.com/niyan/niyan-bundle-0.1.0.tgz'",
    "export NIYAN_LICENSE_KEY='<jwt from invite email>'",
    "# NIYAN_PULL_ON_INSTALL=1 is the default — pulls images after install",
    "curl -fsSL https://yourwebsite.com/niyan/install.sh | bash",
    "source ~/.zshrc",
    "",
    "# 3) Start stack (pulls private Niyan images + public OSS if not already pulled)",
    "niyan doctor",
    "niyan up --pull    # or: niyan pull && niyan up"
  ].join('\n');

  const planVm = document.getElementById('plan-vm');
  const planK8s = document.getElementById('plan-k8s');
  const k8sToast = document.getElementById('k8s-toast');
  const detailSection = document.getElementById('subscription-detail');
  const subscribeCard = document.getElementById('vm-subscribe-card');
  const installCard = document.getElementById('vm-install-card');
  const form = document.getElementById('vm-subscription-form');
  const submitBtn = document.getElementById('btn-vm-subscribe');
  const welcome = document.getElementById('install-welcome');
  const copyAllBtn = document.getElementById('btn-copy-all');
  const copyStatus = document.getElementById('copy-status');
  const installPre = document.getElementById('install-commands');

  if (installPre) {
    installPre.querySelector('code').textContent = INSTALL_COMMANDS + '\n';
  }

  function readSubscription() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function showDetail() {
    detailSection.hidden = false;
    detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function selectVm(openForm) {
    planVm.classList.add('plan-card--selected');
    planVm.setAttribute('aria-pressed', 'true');
    planK8s.classList.remove('plan-card--selected');
    k8sToast.hidden = true;
    showDetail();

    const existing = readSubscription();
    if (existing) {
      showInstall(existing);
    } else if (openForm !== false) {
      subscribeCard.hidden = false;
      installCard.hidden = true;
    }
  }

  function showInstall(sub) {
    subscribeCard.hidden = true;
    installCard.hidden = false;
    if (welcome && sub) {
      const who = sub.company || sub.email || 'your organization';
      welcome.textContent =
        `Subscription is active for ${who}. Use the PAT, GitHub username, and license JWT from your invite email — they are not published on the public website.`;
    }
  }

  planVm.addEventListener('click', () => selectVm(true));

  planK8s.addEventListener('click', () => {
    planK8s.classList.add('plan-card--soon-pulse');
    k8sToast.hidden = false;
    window.setTimeout(() => planK8s.classList.remove('plan-card--soon-pulse'), 600);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const consent = document.getElementById('sub-consent');
    if (!consent.checked) {
      consent.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Activating subscription...';

    const data = {
      name: form.fullname.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim(),
      timestamp: new Date().toISOString()
    };

    window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* localStorage may be blocked; still show install steps */
      }
      showInstall(data);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get VM Subscription';
      installCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  });

  copyAllBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS);
      copyStatus.textContent = 'Copied to clipboard';
    } catch {
      copyStatus.textContent = 'Select the commands and copy manually';
    }
    window.setTimeout(() => {
      copyStatus.textContent = '';
    }, 2500);
  });

  const existing = readSubscription();
  if (existing) {
    planVm.classList.add('plan-card--selected');
    planVm.setAttribute('aria-pressed', 'true');
    detailSection.hidden = false;
    showInstall(existing);
  }
});
