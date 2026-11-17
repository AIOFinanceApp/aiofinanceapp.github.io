// Native links and static HTML work without JavaScript.
// Move keyboard focus to the dedicated page heading once the page has loaded.
const entry=document.body.dataset.entry || 'home';
function focusEntry(){
  if(entry!=='home' && !location.hash)document.getElementById(entry+'-title')?.focus({preventScroll:true});
}
if(document.readyState==='complete')focusEntry();
else window.addEventListener('load',()=>setTimeout(focusEntry,0),{once:true});
