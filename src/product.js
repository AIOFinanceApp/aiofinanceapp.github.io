const tools = [
 ['opportunity','Opportunity Comparison','Compare saved Rental and Business worksheets side by side.','Select saved scenarios to include.','Annual operating profit, financing payments and cash flow. Return measures keep their original basis.','Reopen the source scenarios. Export the comparison from Business Reports.'],
 ['projection','Investment Projection','Explore how an investment balance may grow over time.','Starting balance, monthly contribution, annual return and horizon. Optional inputs include annual contributions, timing and inflation.','Projected balances and charts based on the assumptions entered.','Save a projection and export available projection reports.'],
 ['freedom','Financial Freedom','Estimate the investment balance needed for your desired annual retirement income.','Desired yearly income and withdrawal rate. Use Retirement Income Gap to account for other income.','The income target divided by the withdrawal rate estimates the investment balance needed.','Review the target in Financial Overview when available.'],
 ['debt','Debt Tools','Model a new loan, test extra payments, or compare repayment strategies.','Loan balance or principal, interest, term or payment details. Extra payment inputs vary by calculator.','Payment schedules, payoff timelines and interest. Compare Snowball and Avalanche on existing liabilities.','Save Loan Calculator scenarios. Export supported debt reports.'],
 ['business','Business Analysis','Estimate a business’s profitability, break-even point, and cash flow.','Revenue, fixed and variable expenses, and financing assumptions.','Modeled profit, cash flow, and break-even results when the assumptions support them.','Save the scenario and export available Business Reports.'],
 ['dollar','Dollar Bender','Explore how a change in income or spending affects your budget.','Set a monthly amount or percentage change.','Compare current and simulated take-home income, spending and available cash.','Review the result in the worksheet.'],
 ['life','Life in Motion','Explore household changes through dedicated worksheets.','Choose Growing Your Family or Homeownership, then set the starting point and financial assumptions.','Review how added costs or home financing could affect your household.','Save supported event scenarios and export applicable reports.'],
 ['stress','The Stress Test','Explore how a disruption could affect your finances.','Choose a disruption, baseline and projection horizon.','Review modeled income, costs and reserves over time.','Save and report on supported Stress Test scenarios.'],
 ['rental','Rental Analysis','Estimate what a rental might earn after costs and financing.','Purchase price, closing costs, financing, rent, operating costs, and vacancy. Vacancy reduces expected rental income for periods without tenants.','Net operating income, cash flow, and return measures such as cap rate and cash-on-cash return.','Save rental assumptions and generate a Rental Analysis report.']
];
const screens = {home:'Home',budget:'Budget',assets:'Assets',planning:'Planning'};
function buttons(group, options, onChange) {
 const wrapper = document.getElementById(group);
 const controls = new Map();
 for (const [id,label,color] of options) {
   const button = document.createElement('button');
   button.type = 'button';
   button.dataset.key = id;
   button.setAttribute('aria-pressed','false');
   if (color) {
     const swatch = document.createElement('span');
     swatch.className = 'swatch';
     swatch.style.backgroundColor = color;
     button.append(swatch);
   }
   button.append(label);
   button.addEventListener('click',()=>onChange(id));
   wrapper.append(button);
   controls.set(id,button);
 }
 return key => controls.forEach((button,id)=>button.setAttribute('aria-pressed',String(id===key)));
}
function picture(id, name, alt) {
 const image = document.getElementById(id);
 image.src = 'assets/product/'+name+'.webp';
 image.alt = alt;
 if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
   image.getAnimations().forEach(animation=>animation.cancel());
   image.animate([{opacity:.65},{opacity:1}],{duration:200});
 }
}
function tool(id) {
 const [slug,title,intro,inputs,outputs,retention] = tools.find(row=>row[0]===id);
 document.querySelectorAll('#tools button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.key===id)));
 document.getElementById('tool-copy').innerHTML = '<h3>'+title+'</h3><p>'+intro+'</p><dl><dt>Inputs</dt><dd>'+inputs+'</dd><dt>Results</dt><dd>'+outputs+'</dd><dt>Scenarios &amp; Reports</dt><dd>'+retention+'</dd></dl>';
 if (['projection','freedom','business','rental'].includes(slug)) {
   const link=document.createElement('a');
   link.href='assets/product/santorini-dark-'+slug+'-results.webp';
   link.textContent='View Example Results';
   link.className='result-link';
   document.getElementById('tool-copy').append(link);
 }
 picture('tool-img','santorini-dark-'+slug,title+' screen with fictional inputs');
}
if (document.getElementById('tools')) {
buttons('tools',tools.map(([id,name])=>[id,name]),tool);
document.querySelector('[data-opportunity]').addEventListener('click',()=>tool('opportunity'));
tool('opportunity');
}
if (document.getElementById('dark-themes')) {
  const { dark, light } = window.AIO_THEMES;
  const names = new Map([...dark, ...light].map(([id, name]) => [id, name]));
  const defaults = new Set(['dollar-dark', 'dollar-light']);
  let theme = 'dollar-dark';
  let screen = 'budget';

  function themeOptions(group) {
    return group.map(([id, name, color]) => [id, defaults.has(id) ? name + ' \u00b7 Default' : name, color]);
  }

  function selectTheme(key) {
    theme = key;
    showTheme();
  }

  const markDark = buttons('dark-themes', themeOptions(dark), selectTheme);
  const markLight = buttons('light-themes', themeOptions(light), selectTheme);
  const markScreen = buttons('theme-screens', Object.entries(screens), key => {
    screen = key;
    showTheme();
  });

  function showTheme() {
    const title = names.get(theme);
    markDark(theme);
    markLight(theme);
    markScreen(screen);
    document.getElementById('theme-caption').textContent = title + ' \u00b7 ' + screens[screen];
    picture('theme-img', theme + '-' + screen, screens[screen] + ' screen in ' + title);
  }

  showTheme();
}
const inventory = window.AIO_REPORTS;
if (inventory) {
 document.getElementById('report-types').textContent=inventory.types.join(' · ');
 document.getElementById('report-previews').innerHTML=inventory.previews.map(([slug,title])=>'<figure><a href="assets/product/report-'+slug+'.webp"><img loading="lazy" width="860" height="1100" src="assets/product/report-'+slug+'.webp" alt="'+title+' example generated with fictional data"></a><figcaption>'+title+'</figcaption></figure>').join('');
}
