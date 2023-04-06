const crosshair = document.querySelector(".crosshair");
const pistol = document.querySelector(".pistol");
const spawnPoint = document.querySelector(".spawn-point");

let isPistolDisable = false;

const updateCrosshairPosition = (x, y) => {
  crosshair.style.setProperty("--x", `${x}px`);
  crosshair.style.setProperty("--y", `${y}px`);
};

const updatePistolDisability = (crosshairX, crosshairY) => {
  const deltaY = crosshairY - window.innerHeight / 2;
  const deltaX = crosshairX - window.innerWidth / 2;

  const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  isPistolDisable = distance < 240;
  if (isPistolDisable) {
    pistol.classList.add("disabled");
    return;
  }

  pistol.classList.remove("disabled");
};

const updatePistolRotation = (crosshairX, crosshairY) => {
  if (isPistolDisable) return;

  pistol.style.transform = `rotate(${pistolAngle(crosshairX, crosshairY)}rad)`;
};

const pistolAngle = (crosshairX, crosshairY) => {
  const rect = spawnPoint.getBoundingClientRect();
  const middleX = rect.x + rect.width / 2;
  const middleY = rect.y + rect.height / 2;

  const deltaY = crosshairY - middleY;
  const deltaX = crosshairX - middleX;

  let angle = Math.atan(deltaY / deltaX);
  if (deltaX < 0) angle += Math.PI;

  return angle;
};

const spawnBullet = (crosshairX, crosshairY) => {
  if (isPistolDisable) return;

  const bullet = document.createElement("img");
  bullet.classList.add("bullet");
  bullet.src = "./illustrations/bullet.svg";

  const { x, y } = spawnPoint.getBoundingClientRect();
  bullet.style.insetBlockStart = `${y}px`;
  bullet.style.insetInlineStart = `${x}px`;

  document.body.append(bullet);

  const angle = pistolAngle(crosshairX, crosshairY);
  const animation = bullet.animate(
    [
      {
        transform: `rotate(${angle}rad) translateX(0)`,
      },
      {
        transform: `rotate(${angle}rad) translateX(1000px)`,
      },
    ],
    {
      duration: 1000,
    }
  );

  animation.addEventListener("finish", () => {
    bullet.remove();
  });
};

const initializeEventListeners = () => {
  document.addEventListener("mousemove", (e) => {
    updateCrosshairPosition(e.clientX, e.clientY);
    updatePistolDisability(e.clientX, e.clientY);
    updatePistolRotation(e.clientX, e.clientY);
  });
  document.addEventListener("click", (e) => {
    spawnBullet(e.clientX, e.clientY);
  });
};

const main = () => {
  initializeEventListeners();
};
main();
