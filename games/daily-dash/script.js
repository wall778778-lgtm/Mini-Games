(() => {
  const words = "APPLE BEACH BRAIN BRAVE BREAD BRICK BRUSH CANDY CHARM CHEER CHESS CHIME CHIRP CLOUD COACH COAST COLOR CROWN DANCE DREAM DRIFT EAGLE EARTH FLAME FROST GHOST GIANT GLOBE GRACE GRAPE GREEN HEART HONEY HORSE HOUSE HUMAN JELLY JUICE KNIFE LAUGH LEMON LIGHT MAGIC MAPLE MATCH METAL MONEY MOUSE MUSIC NERVE NIGHT OCEAN OLIVE PAINT PEACH PEARL PHASE PIANO PILOT PIZZA PLANT PLATE PRIZE QUEEN QUICK QUIET RANCH REACH RIVER ROBOT ROUND SAUCE SCALE SCENE SHAPE SHARE SHINE SHORE SNAKE SOLAR SPARK SPEAK SPICE STACK STAGE STAIR STAMP STONE STORM STORY SUGAR SUPER SWEET TABLE TIGER TOAST TOUCH TOWER TRACE TRAIN TREAT TRUST UNITY VALUE VIDEO VIVID WALTZ WATER WHEEL WORLD WRITE YOUTH ZEBRA".split(" ");
  const rows = ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
  const board = document.querySelector("#board"), keyboard = document.querySelector("#keyboard"), message = document.querySelector("#message");
  const today = new Date(); const day = Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate());
  let practice = false, answer = "", guesses = [], current = "", finished = false;
  const dailyIndex = Math.floor(day / 86400000) % words.length;
  const local = (() => { try { return JSON.parse(localStorage.getItem("daily-dash-progress") || "{}"); } catch { return {}; } })();
  const dateKey = new Date(day).toISOString().slice(0,10);
  function setMessage(text) { message.textContent = text; }
  function render() {
    board.innerHTML = "";
    for (let r=0;r<6;r++) for(let c=0;c<5;c++) {
      const tile=document.createElement("div"); tile.className="tile"; tile.setAttribute("role","gridcell");
      const letter=(guesses[r] || "")[c] || (r===guesses.length ? current[c] : ""); tile.textContent=letter;
      if(letter) tile.classList.add("filled");
      if(guesses[r]) { const a=answer[r]===letter, present=answer.includes(letter); tile.classList.add(a?"correct":present?"present":"absent"); }
      board.append(tile);
    }
    keyboard.innerHTML="";
    rows.forEach((letters,i)=> { const row=document.createElement("div");row.className="key-row";
      if(i===2) addKey(row,"ENTER",submit,true);
      [...letters].forEach(ch=>{const key=addKey(row,ch,()=>type(ch),false);const status=keyStatus(ch);if(status)key.classList.add(status);});
      if(i===2) addKey(row,"⌫",()=>{if(!finished)current=current.slice(0,-1);render();},true); keyboard.append(row);
    });
    document.querySelector("#streakLabel").textContent=`🔥 ${local.streak||0} day streak`;
    document.querySelector("#bestLabel").textContent=local.best||0;
    document.querySelector("#share").disabled=!finished;
  }
  function keyStatus(ch) { let state=""; guesses.forEach(g=>{const idx=answer.indexOf(ch);if(idx>=0)state=g[idx]===ch?"correct":"present";else if(!state)state="absent";});return state; }
  function addKey(row,label,action,wide) {const b=document.createElement("button");b.type="button";b.className=`key${wide?" wide":""}`;b.textContent=label;b.setAttribute("aria-label",label==="⌫"?"Delete last letter":label);b.addEventListener("click",action);row.append(b);return b;}
  function type(ch) {if(finished||current.length>=5)return;current+=ch;render();}
  function submit() {
    if(finished)return;
    if(current.length!==5){setMessage("Your guess needs five letters.");return;}
    if(!words.includes(current)){setMessage("That word isn’t in this puzzle. Try another.");return;}
    guesses.push(current); const won=current===answer; current="";
    if(won||guesses.length===6) {finished=true; const result=won?`Brilliant! You found ${answer}.`: `The word was ${answer}.`;
      if(!practice) saveDaily(won); setMessage(result); document.querySelector("#share").disabled=false;
    } else setMessage("Nice guess. Keep going!"); render();
  }
  function saveDaily(won) {
    if(local.lastDate!==dateKey) { const yesterday=new Date(day-86400000).toISOString().slice(0,10); local.streak=won?(local.lastDate===yesterday?(local.streak||0)+1:1):0; local.best=Math.max(local.best||0,local.streak); local.lastDate=dateKey; }
    try { localStorage.setItem("daily-dash-progress",JSON.stringify(local)); } catch {}
  }
  function start(isPractice) {practice=isPractice; answer=isPractice?words[Math.floor(Math.random()*words.length)]:words[dailyIndex]; guesses=[];current="";finished=false;document.querySelector("#modeLabel").textContent=isPractice?"PRACTICE MODE":"TODAY'S PUZZLE";setMessage("Type a word and press Enter.");render();}
  window.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==="Enter"){e.preventDefault();submit();}else if(e.key==="Backspace"){e.preventDefault();if(!finished)current=current.slice(0,-1);render();}else if(/^[a-z]$/i.test(e.key))type(e.key.toUpperCase());});
  document.querySelector("#newPuzzle").addEventListener("click",()=>start(true));
  document.querySelector("#share").addEventListener("click",async()=>{const result=`Daily Dash ${dateKey}\n${guesses.length}/6 ${finished&&guesses.at(-1)===answer?"solved":"tries"}\n`+guesses.map(g=>[...g].map((ch,i)=>answer[i]===ch?"🟩":answer.includes(ch)?"🟨":"⬛").join("")).join("\n");try{await navigator.clipboard.writeText(result);setMessage("Result copied. Share it with a friend!");}catch{setMessage(result);}});
  start(false);
})();
