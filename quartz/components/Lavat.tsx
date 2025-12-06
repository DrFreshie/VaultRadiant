import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/lavat.scss"

const lavaScript = String.raw`(() => {
  function start() {
    const canvas = document.getElementById("lava-lamp");
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      setTimeout(start, 50);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // size of one logical cell in *real* pixels
    const cellSize = 2;

    // logical grid size (in cells) – will be set in resize()
    let w = 160;
    let h = 120;

    // make canvas follow container width with fixed aspect ratio
    function resize() {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      canvas.width = cw;
      canvas.height = ch;

      // grid dimensions in *cells* so that cells line up with real pixels
      w = Math.floor(cw / cellSize);
      h = Math.floor(ch / cellSize);
    }

    resize();
    window.addEventListener("resize", resize);

    const balls = [];

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function dist(x1, y1, x2, y2) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function init() {
      balls.length = 0;
      for (let i = 0; i < 6; i++) {
        balls.push({
          x: rand(0, w),
          y: rand(0, h),
          dx: rand(0.1, 0.3),
          dy: rand(0.1, 0.3),
        });
      }

      requestAnimationFrame(loop);
    }

    function loop() {
      update();
      display();
      requestAnimationFrame(loop);
    }

    function update() {
      for (const b of balls) {
        b.x += b.dx;
        b.y += b.dy;

        if (b.x > w || b.x < 0) b.dx *= -1;
        if (b.y > h || b.y < 0) b.dy *= -1;
      }
    }

    function display() {
      // Clear background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // step size in *cells*
      const pixel = 2;

      for (let x = 0; x < w; x += pixel) {
        for (let y = 0; y < h; y += pixel) {
          let sum = 0;

          for (const b of balls) {
            const d = dist(x, y, b.x, b.y) || 0.0001;
            sum += 1 / d;
          }

          if (sum > 0.09) {
            ctx.fillStyle = "#CBA8F7";

            // draw aligned to real pixels (no scaling → no grid)
            ctx.fillRect(
              x * cellSize,
              y * cellSize,
              pixel * cellSize,
              pixel * cellSize
            );
          }
        }
      }
    }

    init();
  }

  start();
})();`;

const LavaLamp: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "lava-lamp-container")}>
      <canvas id="lava-lamp"></canvas>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: lavaScript }}
      />
    </div>
  )
}

LavaLamp.css = style

export default (() => LavaLamp) satisfies QuartzComponentConstructor
