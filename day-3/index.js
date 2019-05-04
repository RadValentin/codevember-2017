const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const angle = Math.PI / 4;
const ratio = Math.sqrt(2) / 2;
let size = 0;
let totalSteps = 12;
let startColor = [0x50, 0x2d, 0x17];
let endColor = [0xab, 0xc8, 0x3c];

function drawStep(stepNo) {
  if (stepNo === 0) {
    ctx.fillRect(0, 0, size, size);
    ctx.strokeRect(0, 0, size, size);
  } else {
    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.rotate(-angle);
    ctx.translate(0, -size);
    drawStep(stepNo - 1);
    ctx.restore();

    ctx.save();
    ctx.translate(size, 0);
    ctx.scale(ratio, ratio);
    ctx.rotate(angle);
    ctx.translate(-size, -size);
    drawStep(stepNo - 1);
    ctx.restore();
  }
}

function setStepColor(stepNo) {
  const stepColor = startColor
    .map((c, i) => c + (endColor[i] - c) * (stepNo / totalSteps))
    .map(Math.floor)
    .join(',');

  ctx.strokeStyle = `rgb(${stepColor})`;
  ctx.fillStyle = `rgb(${stepColor})`;
}

function loopSteps(stepNo) {
  if (stepNo < totalSteps) {
    window.requestAnimationFrame(() => {
      setStepColor(stepNo);
      drawStep(stepNo);
      loopSteps(++stepNo);
    });
  }
}

function drawTree() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  size = Math.min(canvas.width / 6, canvas.height / 4);

  const left = (canvas.width - size) / 2;
  const top = canvas.height / 2 + size;

  ctx.translate(left, top);
  loopSteps(0);
}

window.addEventListener("resize", drawTree);
drawTree();