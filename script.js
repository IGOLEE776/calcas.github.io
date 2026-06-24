const display = document.getElementById('display');
const modeEl  = document.getElementById('mode');
const badgefunc = document.getElementById('func');
const badgeerr = document.getElementById('err');

let current   = '0';
let operator  = null;
let previous  = null;
let resetNext = false;
let error = false;

/* ── Update display ── */
function updateDisplay(val) {
  display.classList.remove('flash');
  void display.offsetWidth;
  display.classList.add('flash');
  let str = String(val);
  if (str !== 'Error' && str.replace('-','').replace('.','').length > 14) {
    str = parseFloat(val).toExponential(6);
  }
  display.textContent = str;
}

/* ── Core calculation ── */
function calculate() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case '+': result = a + b; break;
    case '−': result = a - b; break;
    case '×': result = a * b; break;
    case '÷': result = b !== 0 ? a / b : 'Math Error'; break;
    default: return;
  }

  current   = (result === 'Math Error' ?? 'Overflow') ? ('Math Error' ?? 'Overflow') : String(parseFloat(result.toFixed(10)));
  previous  = current;
  resetNext = true;
  updateDisplay(current);

  if (current === 'Math Error' ?? 'Overflow') {
    error = true;
    badgeerr.textContent = 'E';
  }
}

/* ── Button click handler ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value  = btn.dataset.value;

    // Block input after Error except C
    if (error === true && action !== 'clear') {
        return;
    }

    if (action === 'number') {
      if (current === '0' || resetNext) {
        current   = value;
        resetNext = false;
      } else {
        if (current.replace('-','').replace('.','').length < 12) current += value;
      }
      updateDisplay(current);
    }

    else if (action === 'decimal') {
      if (resetNext) { current = '0'; resetNext = false; }
      if (!current.includes('.')) current += '.';
      updateDisplay(current);
    }

    else if (action === 'clear') {
      current   = '0';
      operator  = null;
      previous  = null;
      resetNext = false;
      modeEl.textContent = 0;
      badgefunc.textContent = '';
      badgeerr.textContent = '';
      updateDisplay(current);
    }

    else if (action === 'backspace') {
      if (resetNext) return;
      current = current.length > 1 ? current.slice(0, -1) : '0';
      updateDisplay(current);
    }

    else if (action === 'percent') {
      current = String(parseFloat(current) / 100);
      updateDisplay(current);
    }

    else if (action === 'operator') {
      if (operator && !resetNext) calculate();
      if (error !== true) {
        previous  = current;
        operator  = value;
        resetNext = true;
        badgefunc.textContent = value;
      }
    }

    else if (action === 'equals') {
      if (operator && previous !== null) {
        calculate();
        operator = null;
        modeEl.textContent += 1;
        badgefunc.textContent = '=';
      }
    }
  });
});

/* ── Keyboard support ── */
document.addEventListener('keydown', e => {
  const keyMap = {
    '0':'0','1':'1','2':'2','3':'3','4':'4',
    '5':'5','6':'6','7':'7','8':'8','9':'9',
  };

  if (keyMap[e.key]) {
    document.querySelector(`[data-value="${keyMap[e.key]}"]`)?.click();
  } else if (e.key === '+') {
    document.querySelector('[data-value="+"]')?.click();
  } else if (e.key === '-') {
    document.querySelector('[data-value="−"]')?.click();
  } else if (e.key === '*') {
    document.querySelector('[data-value="×"]')?.click();
  } else if (e.key === '/') {
    e.preventDefault();
    document.querySelector('[data-value="÷"]')?.click();
  } else if (e.key === 'Enter' || e.key === '=') {
    document.querySelector('[data-action="equals"]')?.click();
  } else if (e.key === 'Backspace') {
    document.querySelector('[data-action="backspace"]')?.click();
  } else if (e.key === 'Escape') {
    document.querySelector('[data-action="clear"]')?.click();
  } else if (e.key === '.') {
    document.querySelector('[data-action="decimal"]')?.click();
  } else if (e.key === '%') {
    document.querySelector('[data-action="percent"]')?.click();
  }
});