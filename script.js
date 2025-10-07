// Theme toggle functionality
function toggleTheme() {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  const currentTheme = html.getAttribute('data-theme');
  
  if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
  } else {
    html.setAttribute('data-theme', 'light');
    themeIcon.className = 'fas fa-moon';
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function compute2Way() {
  const resultsContainer = document.getElementById('results');
  
  // Show loading state
  resultsContainer.innerHTML = '<div class="calculating">Computing design parameters...</div>';
  
  setTimeout(() => {
    try {
      const Z0 = parseFloat(document.getElementById('Z0').value);
      let P1 = parseFloat(document.getElementById('P1').value);
      let P2 = parseFloat(document.getElementById('P2').value);
      
      if (!(Z0 > 0)) {
        showError('Invalid system impedance Z₀');
        resultsContainer.innerHTML = '<div class="placeholder-state">Invalid input parameters</div>';
        return;
      }
      
      if (!(P1 > 0 && P2 > 0)) {
        showError('P₁ and P₂ must be greater than 0');
        resultsContainer.innerHTML = '<div class="placeholder-state">Invalid power fractions</div>';
        return;
      }
      
      // Normalize power fractions
      const sum = P1 + P2;
      P1 /= sum;
      P2 /= sum;
      const r = P1 / P2;
      
      // Effective Z0
      const Z0eff = Z0;
      
      // Compute impedances
      const Z1 = Z0eff * Math.sqrt(Math.pow(r, -1.5) + Math.pow(r, -0.5));
      const Z2 = Z0eff * Math.sqrt(1 + r) * Math.pow(r, 0.25);
      const Z3 = Z0eff * Math.pow(r, -0.25);
      const Z4 = Z0eff * Math.pow(r, 0.25);
      const Rw = Z0eff * (Math.sqrt(r) + 1/Math.sqrt(r));
      
      // Display results
      let html = `
        <div class="result-display">
          <div class="result-title">
            <i class="fas fa-check-circle"></i>
            Design Parameters
          </div>
          <div class="result-grid">
      `;
      
      const results = [
        { label: 'Impedance Z₁', value: `${Z1.toFixed(2)} Ω` },
        { label: 'Impedance Z₂', value: `${Z2.toFixed(2)} Ω` },
        { label: 'Impedance Z₃', value: `${Z3.toFixed(2)} Ω` },
        { label: 'Impedance Z₄', value: `${Z4.toFixed(2)} Ω` },
        { label: 'Isolation Resistor R<sub>w</sub>', value: `${Rw.toFixed(2)} Ω` },
        { label: 'Split Ratio r', value: r.toFixed(4) }
      ];
      
      results.forEach(result => {
        html += `
          <div class="result-item">
            <div class="result-label">${result.label}</div>
            <div class="result-value updated">${result.value}</div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
      
      resultsContainer.innerHTML = html;
      resultsContainer.className = 'animate-in';
    } catch (error) {
      showError(`Calculation error: ${error.message}`);
      resultsContainer.innerHTML = '<div class="placeholder-state">Calculation failed. Please check your input values.</div>';
    }
  }, 800);
}
