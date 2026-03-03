const transcriptEl = document.getElementById("transcript");
const statusEl = document.getElementById("status");
const app = document.querySelector(".app");

let finalText = "";
let isListening = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.onend = () => {
  if (isListening) recognition.start();
};

recognition.onresult = e => {
  let interim = "";
  for(let i=e.resultIndex;i<e.results.length;i++){
    const txt = e.results[i][0].transcript;
    if(e.results[i].isFinal) finalText += txt + " ";
    else interim += txt;
  }
  transcriptEl.innerText = finalText + interim;
};

document.getElementById("startBtn").onclick = () => {
  if(isListening) return;
  isListening = true;
  recognition.start();
  statusEl.innerText = "LISTENING...";
  app.classList.add("listening");
};

document.getElementById("stopBtn").onclick = () => {
  if(!isListening) return;
  isListening = false;
  recognition.stop();
  statusEl.innerText = "Stopped";
  app.classList.remove("listening");
};

document.getElementById("copyBtn").onclick = () =>
  navigator.clipboard.writeText(transcriptEl.innerText);

document.getElementById("clearBtn").onclick = () => {
  finalText="";
  transcriptEl.innerText="Your speech will appear here...";
};

document.getElementById("pdfBtn").onclick = () => {
  const capture = document.getElementById("capture");
  html2canvas(capture,{scale:2,backgroundColor:null}).then(canvas=>{
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p","mm","a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData,"PNG",0,10,w,h);
    pdf.save("Voxera-Transcript.pdf");
  });
};

document.getElementById("imgBtn").onclick = () => {
  html2canvas(document.getElementById("capture")).then(canvas=>{
    const link=document.createElement("a");
    link.download="Voxera-Transcript.png";
    link.href=canvas.toDataURL();
    link.click();
  });
};
