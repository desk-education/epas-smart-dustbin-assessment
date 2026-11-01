
// ============================================================
// TEACHER CONFIGURATION
// Paste the deployed Google Apps Script Web App URL below.
// Example: https://script.google.com/macros/s/XXXXX/exec
// ============================================================
const GOOGLE_SCRIPT_URL = "";
const TEACHER_ACCESS_CODE = "access4321";

// Keep the quiz questions and answer key in one place.
const quizQuestions = [
 {q:"What is Arduino commonly used for?",o:["Playing online videos","Controlling electronic projects","Printing documents","Browsing websites"],a:1,e:"Arduino can be programmed to control electronic components."},
 {q:"In our project, Arduino acts like the ____.",o:["Brain","Dustbin","Battery","Lid"],a:0,e:"Arduino processes information and controls the project."},
 {q:"Which component detects the hand near the dustbin?",o:["Servo motor","Jumper wire","Ultrasonic sensor","USB cable"],a:2,e:"The HC-SR04 ultrasonic sensor measures distance."},
 {q:"What is the main job of the servo motor?",o:["Measure distance","Move the lid","Store student answers","Send sound waves"],a:1,e:"The servo motor turns to move the lid."},
 {q:"What does INPUT mean in an Arduino project?",o:["The action performed","Information received by the system","The project's container","The final movement"],a:1,e:"Input is information received from a sensor or another source."},
 {q:"What does Arduino do during the PROCESS stage?",o:["Ignores the sensor","Makes a decision using its program","Throws away waste","Charges the computer"],a:1,e:"Arduino follows instructions and decides what output is needed."},
 {q:"Which part is the OUTPUT device in our Smart Dustbin?",o:["Ultrasonic sensor","Arduino IDE","Servo motor","USB cable"],a:2,e:"The servo motor performs the physical movement."},
 {q:"Which unit is used in the sample program to measure distance?",o:["Kilograms","Centimeters","Liters","Volts"],a:1,e:"The program converts the sensor reading into centimeters."},
 {q:"In the sample program, when does the lid open?",o:["When an object is within 20 cm","When an object is 2 meters away","Only at midnight","Whenever the USB cable is removed"],a:0,e:"The condition checks for a valid distance of 20 cm or less."},
 {q:"What does delay(3000) mean?",o:["Wait 3 milliseconds","Wait 30 seconds","Wait 3 seconds","Move 3 centimeters"],a:2,e:"Arduino delay time is in milliseconds; 3,000 ms equals 3 seconds."},
 {q:"What is the purpose of the TRIG pin on the HC-SR04?",o:["To send the ultrasonic trigger pulse","To rotate the servo","To store the program","To display the score"],a:0,e:"The TRIG pin starts the ultrasonic measurement."},
 {q:"Why should the servo wiring be checked before powering the circuit?",o:["To make the code colorful","To prevent incorrect connections and power problems","To increase the dustbin size","To change the quiz questions"],a:1,e:"Correct wiring and a suitable power supply help protect the components."},
 {q:"A hand is detected 10 cm from the sensor. Based on the sample code, what should happen?",o:["The lid should open","The sensor should be removed","The Arduino should shut down","The lid must stay open forever"],a:0,e:"10 cm is within the 20 cm detection distance."},
 {q:"The lid does not move even though the sensor detects a hand. What is a sensible first step?",o:["Throw away the Arduino","Check the servo wiring, power, and pin connection","Delete the lesson","Increase the dustbin height"],a:1,e:"Check connections and power before changing the program."},
 {q:"Which sequence correctly describes the Smart Dustbin?",o:["Output → Input → Process","Process → Output → Input","Input → Process → Output","Input → Output → Remove Arduino"],a:2,e:"The sensor detects, Arduino processes, and the servo moves the lid."}
];

const $ = id => document.getElementById(id);
const themeToggle = $("themeToggle");
function setTheme(theme){
 document.documentElement.dataset.theme = theme;
 localStorage.setItem("arduinoLessonTheme",theme);
 themeToggle.textContent = theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode";
}
setTheme(localStorage.getItem("arduinoLessonTheme") || "light");
themeToggle.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

// Copy the two code samples.
async function copyTextFrom(id){
 const text = $(id).innerText;
 try{await navigator.clipboard.writeText(text);alert("Code copied to clipboard.");}
 catch(e){alert("Copy is not available in this browser. Please select and copy the code manually.");}
}
function copyCode(){copyTextFrom("arduinoCode");}
function copyScript(){copyTextFrom("appsScriptCode");}

// Interactive classroom simulation. The physical hardware is not controlled here.
function updateDemo(){
 const distance = Number($("distanceSlider").value);
 $("distanceValue").textContent = distance;
 const open = distance <= 20;
 $("demoBin").classList.toggle("open",open);
 $("demoMessage").textContent = open
  ? "Object detected within 20 cm. The Arduino tells the servo to open the lid!"
  : "The hand is farther than 20 cm. The lid stays closed.";
}
$("distanceSlider").addEventListener("input",updateDemo);
$("demoReset").addEventListener("click",()=>{$("distanceSlider").value=35;updateDemo();});
updateDemo();

// Assessment is locked until the teacher's access code is entered.
let unlocked = false;
let submitted = false;
let activeQuestions = [];
function lockAssessment(message="🔒 Assessment locked. Wait for your teacher's signal and access code."){
 unlocked = false;
 $("quizArea").hidden = true;
 $("accessStatus").textContent = message;
 $("accessCode").value = "";
}
function unlockAssessment(){
 const name = $("studentName").value.trim();
 const section = $("studentSection").value.trim();
 const code = $("accessCode").value;
 if(!name || !section){
  $("accessStatus").textContent = "Please enter your full name and grade/section first.";
  return;
 }
 if(code !== TEACHER_ACCESS_CODE){
  $("accessStatus").textContent = "Incorrect access code. Please wait for your teacher and try again.";
  return;
 }
 unlocked = true;
 submitted = false;
 activeQuestions = quizQuestions.map((q,i)=>({...q,originalIndex:i})).sort(()=>Math.random()-.5);
 $("quizArea").hidden = false;
 $("result").hidden = true;
 $("submitQuiz").disabled = false;
 $("accessStatus").textContent = "🔓 Assessment unlocked. Read each question carefully and answer all 15 items.";
 renderQuestions();
 updateProgress();
}
$("unlockBtn").addEventListener("click",unlockAssessment);
$("lockBtn").addEventListener("click",()=>lockAssessment());

function renderQuestions(){
 const holder = $("questions");
 holder.innerHTML = "";
 activeQuestions.forEach((q,index)=>{
  const fieldset = document.createElement("fieldset");
  fieldset.className = "quiz-q";
  const legend = document.createElement("legend");
  legend.textContent = `${index+1}. ${q.q}`;
  fieldset.appendChild(legend);
  q.o.forEach((option,choiceIndex)=>{
   const label = document.createElement("label");
   label.className = "option";
   const input = document.createElement("input");
   input.type = "radio";
   input.name = `question-${index}`;
   input.value = choiceIndex;
   input.addEventListener("change",updateProgress);
   const span = document.createElement("span");
   span.textContent = `${String.fromCharCode(65+choiceIndex)}. ${option}`;
   label.append(input,span);
   fieldset.appendChild(label);
  });
  holder.appendChild(fieldset);
 });
}
function updateProgress(){
 const answered = activeQuestions.filter((q,i)=>document.querySelector(`input[name="question-${i}"]:checked`)).length;
 $("quizProgress").style.width = `${answered/15*100}%`;
 $("progressText").textContent = `${answered} of 15 questions answered`;
}
function getAnswers(){
 return activeQuestions.map((q,i)=>{
  const selected = document.querySelector(`input[name="question-${i}"]:checked`);
  return {questionNumber:i+1,question:q.q,selectedAnswer:selected ? q.o[Number(selected.value)] : "",correctAnswer:q.o[q.a],isCorrect:!!selected && Number(selected.value)===q.a};
 });
}
async function sendToGoogleSheet(payload){
 const savedUrl = localStorage.getItem("arduinoLessonScriptUrl") || "";
 const endpoint = GOOGLE_SCRIPT_URL.trim() || savedUrl.trim();
 if(!endpoint) return {sent:false,reason:"No Apps Script URL is configured."};
 try{
  // text/plain avoids a browser preflight request. no-cors produces an opaque
  // response, so the browser cannot confirm that Apps Script saved the row.
  await fetch(endpoint,{
   method:"POST",
   mode:"no-cors",
   headers:{"Content-Type":"text/plain;charset=utf-8"},
   body:JSON.stringify(payload)
  });
  return {sent:true};
 }catch(error){
  return {sent:false,reason:error.message};
 }
}

// Display a clear completion confirmation without claiming unverified Google Sheets delivery.
function showSubmissionModal(score,sync){
 const modal = document.getElementById("submissionModal");
 document.getElementById("submissionModalMessage").textContent = `Your 15-item assessment was submitted successfully on this page. Your score is ${score} out of 15 (${Math.round(score/15*100)}%).`;
 document.getElementById("submissionModalSyncStatus").textContent = sync.sent
  ? "The Google Sheets submission request was sent. Please ask your teacher to verify that the result was saved."
  : `Google Sheets did not receive a confirmed submission request: ${sync.reason} Please inform your teacher.`;
 modal.hidden = false;
 document.getElementById("closeSubmissionModal").focus();
}
(function initializeSubmissionModal(){
 const modal = document.getElementById("submissionModal");
 const closeButton = document.getElementById("closeSubmissionModal");
 function closeModal(){
  modal.hidden = true;
  document.getElementById("submitQuiz").focus();
 }
 closeButton.addEventListener("click",closeModal);
 modal.addEventListener("keydown",event=>{
  if(event.key === "Escape") closeModal();
  if(event.key === "Tab"){
   event.preventDefault();
   closeButton.focus();
  }
 });
})();

$("quizForm").addEventListener("submit",async event=>{
 event.preventDefault();
 if(!unlocked || submitted) return;
 const answers = getAnswers();
 if(answers.some(a=>!a.selectedAnswer)){
  $("result").hidden = false;
  $("result").textContent = "Please answer all 15 questions before submitting.";
  $("result").scrollIntoView({behavior:"smooth",block:"center"});
  return;
 }
 submitted = true;
 $("submitQuiz").disabled = true;
 const score = answers.filter(a=>a.isCorrect).length;
 const payload = {
  name:$("studentName").value.trim(),
  section:$("studentSection").value.trim(),
  assessmentDate:$("assessmentDate").value,
  score,
  total:15,
  answers,
  submittedAt:new Date().toISOString()
 };
 const result = $("result");
 result.hidden = false;
 result.textContent = `Your score: ${score} / 15 (${Math.round(score/15*100)}%). Sending your result to the teacher's Google Sheet...`;
 result.scrollIntoView({behavior:"smooth",block:"center"});
 const sync = await sendToGoogleSheet(payload);
 if(sync.sent){
  result.innerHTML = `<b>Assessment completed: ${score}/15 (${Math.round(score/15*100)}%).</b><br>Your submission request was sent. Because the browser cannot read the Apps Script response, please ask your teacher to verify that your record appears in Google Sheets.`;
 }else{
  result.innerHTML = `<b>Assessment completed: ${score}/15 (${Math.round(score/15*100)}%).</b><br>Your result was not sent: ${sync.reason}<br>Please inform your teacher and follow the classroom's submission instructions.`;
 }
 lockAssessment("Assessment submitted. Your teacher may now review your result. The quiz is locked.");
 showSubmissionModal(score,sync);
});

// Allow teacher to store a deployment URL in this browser without editing the source.
$("saveUrlBtn").addEventListener("click",()=>{
 const url = $("scriptUrlInput").value.trim();
 if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url)){
  alert("Please enter a valid Google Apps Script Web App URL ending in /exec.");
  return;
 }
 localStorage.setItem("arduinoLessonScriptUrl",url);
 alert("Apps Script URL saved in this browser. This setting does not automatically travel with the HTML file to other devices.");
});

// Monitor external lesson images and hide only an image that cannot be loaded.
// All image files remain hosted at their original external URLs, not inside this HTML.
document.querySelectorAll("img[loading='lazy']").forEach(imageElement=>{
 imageElement.addEventListener("error",()=>{
  imageElement.classList.add("image-load-failed");
  imageElement.alt = imageElement.alt + " (image could not be loaded; check your internet connection or image source URL)";
 },{once:true});
});

// Highlight the navigation link for the section currently in view.
const sections = [...document.querySelectorAll("main .section[id]")];
const navLinks = [...document.querySelectorAll(".navlink")];
if("IntersectionObserver" in window){
 const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));
   }
  });
 },{rootMargin:"-20% 0px -65% 0px"});
 sections.forEach(section=>observer.observe(section));
}


// ============================================================
// POWERPOINT-STYLE UPLOAD PRESENTATION
// This presentation is independent of the existing lesson quiz
// and other JavaScript features. It changes only the visible slide.
// ============================================================
(function initializeUploadPresentation(){
 const presentation = document.getElementById("uploadPresentation");
 if(!presentation) return;
 const slides = Array.from(presentation.querySelectorAll(".upload-slide"));
 const previousButton = document.getElementById("uploadSlidePrevious");
 const nextButton = document.getElementById("uploadSlideNext");
 const counter = document.getElementById("uploadSlideCounter");
 const progress = document.getElementById("uploadSlideProgress");
 let currentSlide = 0;

 function showUploadSlide(index){
  currentSlide = Math.max(0,Math.min(index,slides.length-1));
  slides.forEach((slide,slideIndex)=>{
   const isActive = slideIndex === currentSlide;
   slide.classList.toggle("active",isActive);
   slide.setAttribute("aria-hidden",String(!isActive));
  });
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length-1;
  counter.textContent = `Slide ${currentSlide+1} of ${slides.length}`;
  progress.style.width = `${((currentSlide+1)/slides.length)*100}%`;
 }

 previousButton.addEventListener("click",()=>showUploadSlide(currentSlide-1));
 nextButton.addEventListener("click",()=>showUploadSlide(currentSlide+1));
 document.addEventListener("keydown",event=>{
  if(!presentation.isConnected) return;
  const rect = presentation.getBoundingClientRect();
  const presentationIsInView = rect.bottom > 0 && rect.top < window.innerHeight;
  if(!presentationIsInView) return;
  if(event.key === "ArrowRight" && currentSlide < slides.length-1){
   event.preventDefault();
   showUploadSlide(currentSlide+1);
  }else if(event.key === "ArrowLeft" && currentSlide > 0){
   event.preventDefault();
   showUploadSlide(currentSlide-1);
  }
 });
 showUploadSlide(0);
})();


// ============================================================
// RESPONSIVE SIDEBAR SHOW / HIDE TOGGLE
// Keep the lesson layout usable on desktop, tablet, and smartphone.
// ============================================================
(function initializeSidebarToggle(){
 const toggle = document.getElementById("sidebarToggle");
 const sidebar = document.getElementById("lessonSidebar");
 const layout = document.querySelector(".layout");
 if(!toggle || !sidebar || !layout) return;

 function setSidebarVisible(visible){
  layout.classList.toggle("sidebar-collapsed",!visible);
  toggle.setAttribute("aria-expanded",String(visible));
  toggle.setAttribute("aria-label",visible ? "Hide lesson sidebar" : "Show lesson sidebar");
  toggle.textContent = visible ? "☰ Hide menu" : "☰ Show menu";
  sidebar.setAttribute("aria-hidden",String(!visible));
 }

 toggle.addEventListener("click",()=>{
  setSidebarVisible(layout.classList.contains("sidebar-collapsed"));
 });
 setSidebarVisible(true);
})();

// ============================================================
// TEACHER ANSWER KEY (separate from student assessment access)
// The panel starts hidden and is cleared whenever it is locked.
// ============================================================
(function initializeTeacherAnswerKey(){
 const accessInput = document.getElementById("answerKeyAccessCode");
 const unlockButton = document.getElementById("unlockAnswerKeyBtn");
 const lockButton = document.getElementById("lockAnswerKeyBtn");
 const content = document.getElementById("answerKeyContent");
 const list = document.getElementById("answerKeyList");
 const status = document.getElementById("answerKeyStatus");
 const ANSWER_KEY_ACCESS_CODE = "GAS@2026";

 function hideAnswerKey(message="🔒 Answer key is hidden."){
  content.hidden = true;
  list.replaceChildren();
  accessInput.value = "";
  lockButton.hidden = true;
  unlockButton.hidden = false;
  status.textContent = message;
 }

 function showAnswerKey(){
  if(accessInput.value !== ANSWER_KEY_ACCESS_CODE){
   hideAnswerKey("❌ Incorrect answer-key access code. Please try again.");
   accessInput.focus();
   return;
  }
  const fragment = document.createDocumentFragment();
  quizQuestions.forEach((question,index)=>{
   const item = document.createElement("div");
   item.className = "answer-key-item";
   const heading = document.createElement("p");
   const strong = document.createElement("strong");
   strong.textContent = `${index+1}. ${question.q}`;
   heading.appendChild(strong);
   const answer = document.createElement("p");
   answer.className = "answer-key-correct";
   answer.textContent = `Correct answer: ${String.fromCharCode(65+question.a)}. ${question.o[question.a]}`;
   const explanation = document.createElement("p");
   explanation.textContent = `Explanation: ${question.e}`;
   item.append(heading,answer,explanation);
   fragment.appendChild(item);
  });
  list.replaceChildren(fragment);
  content.hidden = false;
  lockButton.hidden = false;
  unlockButton.hidden = true;
  accessInput.value = "";
  status.textContent = "🔓 Teacher answer key unlocked (15 questions).";
 }

 unlockButton.addEventListener("click",showAnswerKey);
 lockButton.addEventListener("click",()=>hideAnswerKey());
 accessInput.addEventListener("keydown",event=>{
  if(event.key === "Enter"){
   event.preventDefault();
   if(content.hidden) showAnswerKey();
  }
 });
 hideAnswerKey();
})();


// ============================================================
// TEACHER GUIDE ACCESS CONTROL
// The original Google Sheets teacher guide stays hidden until
// the correct access code is entered. This is a client-side gate.
// ============================================================
(function initializeTeacherGuideAccess(){
 const guide = document.getElementById("teacher-guide");
 const input = document.getElementById("teacherGuideAccessCode");
 const unlock = document.getElementById("unlockTeacherGuideBtn");
 const lock = document.getElementById("lockTeacherGuideBtn");
 const status = document.getElementById("teacherGuideAccessStatus");
 const TEACHER_GUIDE_ACCESS_CODE = "P@55w0rd";

 function lockGuide(message="🔒 Teacher guide is locked."){
  guide.hidden = true;
  input.value = "";
  unlock.hidden = false;
  lock.hidden = true;
  status.textContent = message;
 }

 function unlockGuide(){
  if(input.value !== TEACHER_GUIDE_ACCESS_CODE){
   lockGuide("❌ Incorrect teacher guide access code. Please try again.");
   input.focus();
   return;
  }
  guide.hidden = false;
  input.value = "";
  unlock.hidden = true;
  lock.hidden = false;
  status.textContent = "🔓 Teacher guide unlocked. The complete guide is visible below.";
  guide.scrollIntoView({behavior:"smooth",block:"start"});
 }

 unlock.addEventListener("click",unlockGuide);
 lock.addEventListener("click",()=>lockGuide());
 input.addEventListener("keydown",event=>{
  if(event.key === "Enter"){
   event.preventDefault();
   unlockGuide();
  }
 });
 lockGuide();
})();


// ============================================================
// GCASH DONOR RECORD INTEGRATION
// Enter the deployed donor Apps Script Web App /exec URL here.
// This is separate from GOOGLE_SCRIPT_URL for student assessments.
// The supplied Apps Script accepts URLSearchParams via e.parameter.
// A no-cors request cannot confirm that the spreadsheet saved a row.
// ============================================================
const DONATION_GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwa7PURy-pOOsxWuYtM7M4PtDh7Ka1wPI5f6UcecUaagR2LUQj9tTR2AhdSk_BJu9Wwww/exec";
(function initializeDonationModal(){
 const backdrop = document.getElementById("donationBackdrop");
 const dialog = document.getElementById("donationDialog");
 const openButton = document.getElementById("donationOpenBtn");
 const closeButton = document.getElementById("donationCloseBtn");
 const cancelButton = document.getElementById("donationCancelBtn");
 const copyButton = document.getElementById("donationCopyBtn");
 const form = document.getElementById("donationForm");
 const type = document.getElementById("donationDonorType");
 const organizationField = document.getElementById("donationOrganizationField");
 const organization = document.getElementById("donationOrganization");
 const submitButton = document.getElementById("donationSubmitBtn");
 const status = document.getElementById("donationStatus");
 let priorFocus = null;
 function openModal(){
  priorFocus = document.activeElement;
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  closeButton.focus();
 }
 function closeModal(){
  backdrop.hidden = true;
  document.body.style.overflow = "";
  if(priorFocus && typeof priorFocus.focus === "function") priorFocus.focus();
 }
 function updateType(){
  const group = type.value === "Group";
  organizationField.hidden = !group;
  organization.required = group;
  if(!group) organization.value = "";
 }
 openButton.addEventListener("click",openModal);
 closeButton.addEventListener("click",closeModal);
 cancelButton.addEventListener("click",closeModal);
 backdrop.addEventListener("click",event=>{if(event.target === backdrop) closeModal();});
 backdrop.addEventListener("keydown",event=>{
  if(event.key === "Escape"){event.preventDefault();closeModal();}
  if(event.key === "Tab"){
   const focusable = Array.from(dialog.querySelectorAll('button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled])')).filter(el=>el.getClientRects().length);
   if(!focusable.length) return;
   const first = focusable[0],last = focusable[focusable.length-1];
   if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 type.addEventListener("change",updateType);
 updateType();
 copyButton.addEventListener("click",async()=>{
  const number = "09687042059";
  try{
   await navigator.clipboard.writeText(number);
   status.textContent = "GCash number copied. Please verify the recipient in the GCash app.";
  }catch(error){
   status.textContent = "Unable to copy automatically. Please copy 0968-7042-059 manually.";
  }
 });
 form.addEventListener("submit",async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const amount = Number(document.getElementById("donationAmount").value);
  if(!Number.isFinite(amount) || amount <= 0){status.textContent="Enter a valid positive donation amount.";return;}
  const endpoint = DONATION_GOOGLE_SCRIPT_URL.trim();
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(endpoint)){
   status.textContent = "Donor record not sent: the website owner must configure the donor Google Apps Script /exec URL in DONATION_GOOGLE_SCRIPT_URL.";
   return;
  }
  const params = new URLSearchParams();
  params.set("donorName",document.getElementById("donationDonorName").value.trim());
  params.set("donorType",type.value);
  params.set("donorOrganization",organization.value.trim());
  params.set("country",document.getElementById("donationCountry").value.trim());
  params.set("amount",amount.toFixed(2));
  params.set("source","Arduino Smart Dustbin Interactive Lesson - GCash Support");
  submitButton.disabled = true;
  status.textContent = "Sending donor record request…";
  try{
   await fetch(endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:params.toString()});
   status.textContent = "Donor record request sent. Thank you for your support! Please check the Donor Records sheet to confirm it was saved. This does not confirm a GCash payment.";
   form.reset();
   updateType();
  }catch(error){
   status.textContent = "Unable to send the donor record. Check your internet connection and the deployed Apps Script URL, then try again.";
  }finally{submitButton.disabled = false;}
 });
})();
